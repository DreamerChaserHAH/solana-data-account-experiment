use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Clicker{
    pub count: i64,
    pub bump: u8
}