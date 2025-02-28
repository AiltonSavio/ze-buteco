#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]

#[cfg(feature = "export-abi")]
fn main() {
    NFT::print_abi("SPDX-License-Identifier: MIT", "pragma solidity ^0.8.23;");
}