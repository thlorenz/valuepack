# valuepack goals

Community driven rating system for nodejs modules on npm in order to help in selecting the right one. 

## Discuss

In order to make discussing these ideas easier, I created an [exact copy of this readme as a
gist](https://gist.github.com/thlorenz/5610508).

## Why

Whith 50k+ modules on npm finding the right module for the problem you have is becoming more tedious than it needs to
be. Especially newcomers to nodejs are overwhelmed with the amount of modules to choose from.

While github stars/issues/etc. give some indication of the state and quality of a module, it simply isn't sufficient.
valuepack aims to enhance this information with the ability to downvote problematic modules and wheigh these votes
according to the credibility of the voter in the community.

The goal is a community moderated rating system for modules published on npm. 

This will be combined with a search that takes these ratings into account to sort results returned by the current npm
search.

## How it works

valuepack combines github stars with the ability to downvote a module.

- upvotes are derrived from github stars and can only be performed by starring on github
- downvotes are only possible if a person has a credit of downvote stars 
- a history of when votes are performed will be kept to detect modules that once were popular, but no longer apply

## Module Rating Score

Each module receives a score derived from the up/down votes. This score will be taken into account when searching npm
for a specific module. Big differences may even override better keyword/name matches.

## Sorting modules

When searching for a particular keyword, modules will not only be sorted by how well they match the query, but also by
their Rating Score.

Optionally the user may affect priorities given the ordering of results. i.e. Relevance vs. Rating

## Users

Users are github users. They need to log in with their github account and give permissions to watch their behavior
regarding starring repos and filing issues on them.

### User Credibility

credibility is derrived from the following:

- how many upvotes/downvotes modules by the downvoter received
- accepted PRs performed by the user 

### Upvotes

Call into github to star the module in question. Additionally they allow the voter to include a comment that indicates
what the module does particularly well.

### Downvotes

When a user performs a downvote he will be forced to comment on the reason for it.

Aside from a custom downvote comment the following shortcuts make sense:

- does too much (violates rule of parsimony)
- complex API
- missing or unclear readme
- missing examples
- missing, bad or inclomplete tests
- missing ci (i.e. travis/testling)
- slow or no reaction to issues (provide link)
- buggy (provide sample or point to issue)
- code is hard to understand
- code is not javascript and therefore makes it hard to contribute

### Available Downvotes

Available downvotes are derrived from the user's credibility.

When a downvote is performed, it is substracted from the number of upvotes.

### Weighing downvotes

Each downvote is weighed according to the credibility of the downvoter. 

i.e. a downvote of someone with a credibility of 1000 may affect the module's Rating Score 10x as much as a downvote of
someone with a credibility of 100.

## github interaction

Aside from syncing with github stars, valuepack will require or at least encourage a downvoter to create a related
issue. When an issue is created by a user on github and no downvote occurred, he will be encouraged to do so the next
time he comes to valuepack.
