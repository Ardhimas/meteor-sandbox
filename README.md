# Meteor Chat

A chat app built using [Meteor](https://www.meteor.com/) and [React](https://facebook.github.io/react/). Featuring an astronomical theme, authentication, a friends list, and many more features to come.

## Preview
[Check out the app on Heroku.](https://meteor-react-chat.herokuapp.com/) Do keep in mind that as I work towards releasing the first version, changes in the backend **will** cause some things to break. The MongoDB backend is hosted on [mLab's](https://mlab.com/) 500mb free plan on a single database shared by multiple projects, and so that is another potential point of failure.

## Installation

[Install Meteor](https://www.meteor.com/install) if you haven't already.
`curl https://install.meteor.com/ | sh`

Clone the repo.
`git clone https://github.com/Ardhimas/meteor-sandbox.git`

Navigate to root folder.
`cd meteor-sandbox`

Run the app.
`meteor`

## Usage

1. Create an account, no verification required.
2. Find another person or open a private browser to create another account.
3. Add each other to begin chatting with them - friend requests are on the roadmap but for now y'all need to add each other.
4. Start chatting!

## File Structure

```
|-- .meteor/        # auto generated meteor files, do not touch
|-- client/         # client entry point
|-- imports/        # where the magic happens
|---- api/          # backend code and tests
|---- startup/      # initialization/config files
|---- ui/           # frontend code - react jsx files
|-- public/         # static files
|-- server/         # server entry point
|-- .eslintrc.json  # linting rules because messy code hurts my soul
|-- .gitignore      # file patterns to not commit, currently configured only for OSX
|-- package.json    # node package dependencies
|-- yarn.lock       # auto generated yarn file, do not touch
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT, but I sure hope you don't use this in production for anything because there are production-ready alternatives out there such as [Rocket Chat](https://rocket.chat/).
