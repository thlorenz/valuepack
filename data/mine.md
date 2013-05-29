# fields

fields from the npm registry db and github that will be useful to store

- fields to be indexed in **bold**
- fields we may not need in *italic*

## npm users

count: ~8300

### Get all users

    curl -k https://registry.npmjs.org/-/users/

### Minimum
  
  - **name**
  - email
  - *date*

### Extra

  - **github** (should just be name, but some people put full url, extract name then)
  - twitter
  - fullname (may not need)

In case no github info was given, try to resolve gihub user name from npm user name, i.e. ping github with same name and
if the account exists, assume that it is the right one. This will work in 99% of the cases.
Later we can look thru user's repos and if one links github we can check against what we guessed
  
## npm packages

count: ~30600

### Get all packages

    curl -k https://registry.npmjs.org/-/all/

### Minimum

  - **name** (the key)
  - maintainers (first one) **name**
  - repository (type, url)
  - versions
  - *dist-tags*
  - *time (modified)*

### Extra

  - **keywords**
  - description (81 don't have one)
  - keywords
  - *author (name, email)*

## github users

Try to get one for each npm user

    curl -k https://api.github.com/users/<username>

- **login** (username)
- `public_repos` (count)
- followers (count)
- following (count)

- `followers_url`
- `repos_url`

### Followers

via `followers_url`

    curl -k https://api.github.com/users/<username>/followers

- login

has lots more info about each follower, but login should be all we need

### Repos

via `repos_url`

    curl -k https://api.github.com/users/<username>/repos

- name
- **fullname** (`<user>/<reponame>`)
- *description*
- fork (true|false)
- forks (count)
- watchers (count)
- `stargazers_url`
- `issues_url`
- `pulls_url`
- `created_at` (Date)
- `updated_at` (Date)

Follow stargazers, issues and pulls to get more info about the quality of each repo
