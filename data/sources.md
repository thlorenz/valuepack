# Couch

## Get all users

    curl -k https://registry.npmjs.org/-/users/

# Github

## Check github rate limit

    # unauthorized
    curl -i https://api.github.com/

    # authorized
    curl -i https://user:pwd@api.github.com/
