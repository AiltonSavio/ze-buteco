#![cfg_attr(not(test), no_main)]
extern crate alloc;

use alloc::{string::String, vec::Vec};

use alloy_primitives::{Address, U256, U8};
use stylus_sdk::prelude::{entrypoint, public, sol_storage};

sol_storage! {
    #[entrypoint]
    pub struct CervejaNFT {
        /// Token id to owner map
        mapping(uint256 => address) owners;
        /// User to balance map
        mapping(address => uint256) balances;
        /// Token id to approved user map
        mapping(uint256 => address) token_approvals;
        /// User to operator map (the operator can manage all NFTs of the owner)
        mapping(address => mapping(address => bool)) operator_approvals;
        /// Total supply
        uint256 total_supply;
        mapping(uint256 => CervejaMetadata) custom_metadata;
    }

    pub struct CervejaMetadata {
        string name;
        uint8 taste;
        uint8 texture;
        uint8 aroma;
        uint8 smoothness;
    }
}

impl CervejaNFT {
    fn overall_rating(taste: u8, texture: u8, aroma: u8, smoothness: u8) -> u32 {
        // Compute overall rating in tenths. For example, if the average is 4.2, returns 42.
        (taste as u32 + texture as u32 + aroma as u32 + smoothness as u32) * 10 / 4
    }

    fn generate_svg(name: &String, taste: u8, texture: u8, aroma: u8, smoothness: u8) -> String {
        let overall = Self::overall_rating(taste, texture, aroma, smoothness);
        let whole = overall / 10;
        let fraction = overall % 10;
        let width = 300;
        let height = 400;
        // star displaying overall rating, now formatted using integer values.
        let star_svg = format!(
            "<text x='{x}' y='30' font-size='24' fill='gold'>★ {}.{} </text>",
            whole,
            fraction,
            x = width - 100
        );
        // a simple Cerveja bottle represented as a rectangle.
        let bottle_svg = format!(
            "<rect x='125' y='80' width='50' height='80' fill='white' stroke='black' stroke-width='2'/>\
             <rect x='125' y='160' width='50' height='60' fill='yellow' stroke='black' stroke-width='2'/>"
        );
        // render a bar for each stat.
        let full_bar_width = 100;
        let stat_height = 20;
        let stats = vec![
            ("Sabor", taste),
            ("Texture", texture),
            ("Aroma", aroma),
            ("Suavidade", smoothness),
        ];
        let mut stats_svg = String::new();
        for (i, (label, value)) in stats.iter().enumerate() {
            let y = 250 + (i as i32 * stat_height);
            // Compute the fill width: scale the rating (1..=5) to 0..=100.
            let fill_width = (*value as u32 * full_bar_width) / 5;
            stats_svg.push_str(&format!(
                "<text x='10' y='{text_y}' font-size='12' fill='black'>{label}:</text>\
                 <rect x='74' y='{y}' width='{fill_width}' height='10' fill='green'/>\
                 <rect x='74' y='{y}' width='{full_bar_width}' height='10' fill='none' stroke='black' stroke-width='1'/>",
                text_y = y + 10,
                label = label,
                y = y,
                fill_width = fill_width,
                full_bar_width = full_bar_width
            ));
        }
        // Assemble the complete SVG.
        format!(
            "<svg xmlns='http://www.w3.org/2000/svg' width='{width}' height='{height}'>\
                {star_svg}\
                <text x='10' y='30' font-size='16' fill='black'>{name}</text>\
                {bottle_svg}\
                {stats_svg}\
             </svg>",
            width = width,
            height = height,
            star_svg = star_svg,
            name = name,
            bottle_svg = bottle_svg,
            stats_svg = stats_svg
        )
    }
}

#[public]
// #[inherit(Erc721, Metadata)]
impl CervejaNFT {
    pub fn name(&self) -> Result<String, Vec<u8>> {
        Ok(String::from("Cerveja Artesanal NFT"))
    }

    pub fn symbol(&self) -> Result<String, Vec<u8>> {
        Ok(String::from("BEER"))
    }

    /// Gets the number of NFTs owned by an account.
    #[selector(name = "balanceOf")]
    pub fn balance_of(&self, owner: Address) -> Result<U256, Vec<u8>> {
        Ok(self.balances.get(owner))
    }

    /// Gets the owner of the NFT, if it exists.
    #[selector(name = "ownerOf")]
    pub fn owner_of(&self, token_id: U256) -> Result<Address, Vec<u8>> {
        let owner = self.owners.get(token_id);
        if owner.is_zero() {
            return Err(Vec::from("Token not found"));
        }
        Ok(owner)
    }

    #[selector(name = "totalSupply")]
    pub fn total_supply(&self) -> Result<U256, Vec<u8>> {
        Ok(self.total_supply.get())
    }

    pub fn transfer(&mut self, token_id: U256, from: Address, to: Address) -> Result<(), Vec<u8>> {
        let mut owner = self.owners.setter(token_id);
        let previous_owner = owner.get();
        if previous_owner != from {
            return Err(Vec::from("Transfer from incorrect owner"));
        }
        owner.set(to);

        // right now working with storage can be verbose, but this will change upcoming version of the Stylus SDK
        let mut from_balance = self.balances.setter(from);
        let balance = from_balance.get() - U256::from(1);
        from_balance.set(balance);

        let mut to_balance = self.balances.setter(to);
        let balance = to_balance.get() + U256::from(1);
        to_balance.set(balance);

        // cleaning app the approved mapping for this token
        self.token_approvals.delete(token_id);

        Ok(())
    }

    pub fn mint(
        &mut self,
        to: Address,
        name: String,
        taste: u8,
        texture: u8,
        aroma: u8,
        smoothness: u8,
    ) -> Result<(), Vec<u8>> {
        // Validate ratings.
        for rating in &[taste, texture, aroma, smoothness] {
            if *rating < 1 || *rating > 5 {
                return Err(Vec::from("All ratings must be between 1 and 5"));
            }
        }
        let new_token_id = self.total_supply.get();
        self.total_supply.set(new_token_id + U256::from(1u8));
        self.transfer(new_token_id, Address::default(), to)?;
        let mut custom_metadata = self.custom_metadata.setter(new_token_id);
        custom_metadata.name.set_str(name);
        custom_metadata.taste.set(U8::from(taste));
        custom_metadata.texture.set(U8::from(texture));
        custom_metadata.aroma.set(U8::from(aroma));
        custom_metadata.smoothness.set(U8::from(smoothness));
        Ok(())
    }

    #[selector(name = "tokenURI")]
    pub fn token_uri(&self, token_id: U256) -> Result<String, Vec<u8>> {
        let metadata = self.custom_metadata.get(token_id);
        if metadata.name.is_empty() {
            Err(Vec::from("Token not found"))
        } else {
            // Generate the SVG image.
            let svg = Self::generate_svg(
                &metadata.name.get_string(),
                metadata.taste.get().as_limbs()[0] as u8,
                metadata.texture.get().as_limbs()[0] as u8,
                metadata.aroma.get().as_limbs()[0] as u8,
                metadata.smoothness.get().as_limbs()[0] as u8,
            );
            // Construct the JSON metadata.
            let json = format!(
                r#"{{
      "description": "Avaliação de Cerveja Artesanal NFT",
      "external_url": "https://zebuteco.vercel.app/cerveja/{token_id}",
      "image": "data:image/svg+xml;utf8,{svg}",
      "name": "{}",
      "attributes": [
        {{
          "trait_type": "Sabor",
          "value": {}
        }},
        {{
          "trait_type": "Textura",
          "value": {}
        }},
        {{
          "trait_type": "Aroma",
          "value": {}
        }},
        {{
          "trait_type": "Suavidade",
          "value": {}
        }}
      ]
    }}"#,
                metadata.name.get_string(),
                metadata.taste.get().as_limbs()[0] as u8,
                metadata.texture.get().as_limbs()[0] as u8,
                metadata.aroma.get().as_limbs()[0] as u8,
                metadata.smoothness.get().as_limbs()[0] as u8,
                token_id = token_id.as_limbs()[0],
                svg = svg
            );
            Ok(json)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use alloy_primitives::{address, U256};

    #[motsu::test]
    fn mint_and_token_uri_works(contract: CervejaNFT) {
        let test_address = address!("1234567891234567891234567891234567891234");

        // Mint a new NFT with a name and valid ratings.
        let mint_result = contract.mint(
            test_address,
            String::from("Minha Cerveja"),
            5, // taste
            4, // texture
            3, // aroma
            5, // smoothness
        );
        assert!(mint_result.is_ok(), "Minting failed");

        // Retrieve the token URI, which dynamically generates the SVG.
        let uri_result = contract.token_uri(U256::from(0));
        assert!(uri_result.is_ok(), "tokenURI call failed");
        let svg = uri_result.unwrap();

        println!("Generated SVG:\n{}", svg);

        // Check that the SVG contains expected substrings.
        assert!(svg.contains("★"), "SVG does not contain a star for rating");
        assert!(
            svg.contains("Cerveja"),
            "SVG does not contain the expected NFT name"
        );
    }
}
