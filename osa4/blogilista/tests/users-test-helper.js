const User = require('../models/user.js')

const users = {
  DBFormat: [
    {
      name: 'Ahmad',
      username: 'Ahmad_McKenzie1',
      passwordHash: '$2a$10$UXsDTc5aDkJObsMjBu85Ku7/uWuZgl4ASKO8MBY8QB.9q8idlnaFe',
      _id: "61d18fa9c7c2dc8bda893f60",
      __v: 0
    },
    {
      name: 'Christ',
      username: 'Christ0',
      passwordHash: '$2a$10$v.VD/kjG5380HOQuhJrIMOGZdgM9qf8nHkFBXbfWsAmJ58NbrfP1W',
      _id: "61d18fa9c7c2dc8bda893f61",
      __v: 0
    },
    {
      name: 'Salvador',
      username: 'Salvador_Dickinson5',
      passwordHash: '$2a$10$zIxv5zQu75eSSOPXckCT9.j9h5rr8I.QNZ04IxWSgJ0cPga1il/6C',
      _id: "61d18fa9c7c2dc8bda893f62",
      __v: 0
    },
    {
      name: 'Cordell',
      username: 'Cordell_Kutch88',
      passwordHash: '$2a$10$CUbqC.t1ylLCh07Ea6sXrOkQkGlqppRnXgp63X7rDAgN5qv7feNFu',
      _id: "61d18faac7c2dc8bda893f63",
      __v: 0
    },
    {
      name: 'Montana',
      username: 'Montana_Lynch',
      passwordHash: '$2a$10$/uqWFLh3X/0f5tsF5ZbGAeRntDamNI0uZzkYxx5jXJ4uXq1/X4gkO',
      _id: "61d18faac7c2dc8bda893f64",
      __v: 0
    }
  ],
  passwordFormat: [
    {
      name: 'Ahmad',
      username: 'Ahmad_McKenzie1',
      password: 'mqz7uNbsN1zbE3j'
    },
    {
      name: 'Christ',
      username: 'Christ0',
      password: 'H39Tq0gsDEkPdbZ'
    },
    {
      name: 'Salvador',
      username: 'Salvador_Dickinson5',
      password: 'i5sDasudyJIdeJ_'
    },
    {
      name: 'Cordell',
      username: 'Cordell_Kutch88',
      password: 'OgQ9o_zWBPhTlyP'
    },
    {
      name: 'Montana',
      username: 'Montana_Lynch',
      password: 'jK4A1btWUNWkI4G'
    }
  ],
  JSONFormat: [
    {
      name: 'Ahmad',
      username: 'Ahmad_McKenzie1',
      id: "61d18fa9c7c2dc8bda893f60"
    },
    {
      name: 'Christ',
      username: 'Christ0',
      id: "61d18fa9c7c2dc8bda893f61"
    },
    {
      name: 'Salvador',
      username: 'Salvador_Dickinson5',
      id: "61d18fa9c7c2dc8bda893f62"
    },
    {
      name: 'Cordell',
      username: 'Cordell_Kutch88',
      id: "61d18faac7c2dc8bda893f63"
    },
    {
      name: 'Montana',
      username: 'Montana_Lynch',
      id: "61d18faac7c2dc8bda893f64"
    }
  ]
}

async function getUsersInDB() {
    return (await User.find({})).map(user => user.toJSON())
}

async function getUserFromDBByID(id) {
    const foundUser = (await User.findById(id)).toJSON()
    return foundUser
}

function createJSONFormattedUser(user) {
    const newUser = {...user}
    newUser.id = newUser._id
    delete newUser.passwordHash
    delete newUser._id
    delete newUser.__v
    return newUser
}

module.exports = { users, getUsersInDB, getUserFromDBByID, createJSONFormattedUser }