use anchor_lang::prelude::*;
use schema::Clicker;

mod schema;

declare_id!("6nBUbu2dzMVAVg5hoBtANhZGngB8bQypEZ5EZnfz1suj");

#[program]
pub mod solana_click {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.clicker;
        counter.count = 0;
        counter.bump = ctx.bumps.clicker;
        msg!("Counter initialized!");
        Ok(())
    }

    pub fn increase(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.clicker;
        counter.count = counter.count.checked_add(1).unwrap();
        msg!("Counter Increased to {} by {}", counter.count, ctx.accounts.user.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + Clicker::INIT_SPACE,
        seeds = [b"counter"],
        bump,
    )]
    pub clicker: Account<'info, schema::Clicker>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info>{
    #[account(
        mut,
        seeds = [b"counter"],
        bump = clicker.bump,
    )]
    pub clicker: Account<'info, schema::Clicker>,
    pub user: Signer<'info>,
}
