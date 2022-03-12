# Discord Tag Bot
## Table Of Contents
- [Features](#features)
- [Commands](#commands)
- [TODO](#todo)
- [Setup](#setup)
- [License](#license)

## Features
- Per-User keyword management
- Channel whitelisting
- Customizable prefix
- Lightning fast response with Mongo.DB

## Commands

`!kw add [keyword 1] (keyword 2) (keyword 3)...` - Add keyword(s) for the bot to monitor (for specific user)

`!kw remove [keyword]` - Remove a keyword being monitored by the bot (for specific user)

`!kw list` - List all keywords being monitored by the bot (for specific user)

`!kw help` - DM a help message to the user

`!kw ping` - Get this bot's ping

`!kw cadd [channel id]` - Add a channel for the bot to monitor

## TODO
- Add authentication to the addChannel method
- Change message notifications to embeds

## Setup
1. Create a new `.env` file in the root folder, and fill in the parameters listed in .env.sample
2. `npm install`
3. `node server/index.js`

## License
This repository is licensed under GNU General Public License v3.0
