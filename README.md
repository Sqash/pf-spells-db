#Pathfinder Spells Database app

##About

This app is designed to be used to browse all the spells available for the game
Pathfinder (published by Paizo) in a complete and complex fashion that is
useful for players to the game.

We're currently in initial working prototype stages!

###You can:

  - Search all spells listed on the www.d20pfsrd.com for the game.

  - Filter by 1 or more of these spell factors:
    - Spell name
    - Description
    - Class and/or Level
    - School / Subschool
    - Spell descriptor(s)
    - Domain
    - Casting time
    - Components
    - Range, Area, and Effect
    - Targets
    - Duration
    - Saving Throws
    - Spell Resistance

Wow! Isn't that a bunch.

There are even more fun and useful features in the works, so check out the
plans below if you're thinking that it needs a little something more to work
for you! If your idea isn't in there though, send an email with your suggestion
to my github email with "[PFSDB suggestion]" in the subject line!

##Authorship

This app is a little project written by Sam Whiteley, a self-professed tabletop
nerd.

For copyright information and all that see the LICENSE file, as this software
is created and distributed under the GPL v2.0. All content and code within this
application not covered under another license is subject to all terms and
conditions in the LICENSE file.

##Dependencies

- nodejs :: version 0.10.x (0.12.x may work but I haven't tested it)

- npm :: the NodeJS package manager

- bower :: another package manager!

- sqlite3 for NodeJS

- All other dependencies should be managed and handled by npm and bower.

##Installation and Running

###Installation

With npm and bower installed, run in order from the root folder:

1. `npm install`
2. `bower install`
3. `npm install sqlite3`

**Then the one pain in the butt part**

Because angular-ui-bootstrap (which is used for the modal forms currently) was
hooked up as a dependecy after scaffolding, it doesn't build itself for the app
unfortunately. So you've got to do this:

1. change directory to `./client/bower_components/angular-ui-bootstrap`
2. `npm install`
3. `grunt html2js`
4. `grunt build:modal`

*If anyone can tell me how to fix the need of this step I would greatly
appreciete it*

###Running the webapp:

For viewing/usage locally:

1. `grunt serve` (should open a browser tab for you automagically)

##//TODO (near-future development notes)

- !Write script to install bootstrap-ui-modal or something to that effect
  - Maybe figure out a way to jank grunt into using it anyway
- Get some feedback on the initial prototype
- Fix any bugs that come up
- Make sure things are layed out and designed for future expandability
  - Unlink the spellmodal template/feature from the results page so it can be
    reused

##Planned features (coming sooner or later):

- Complex logical queries (ie. descriptor is "fire" or "cold" and not "mind
  affecting")

- Saving recent search history so you can go back to it

- Linking spell entries to each other so you can jump from one to another
  easily

- Have a page for viewing spells by class (sorted by level,school,alpa)

