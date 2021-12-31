const User = require('../models/user.js')

let usersDBFormat = [
    {
      name: 'Nathanial',
      username: 'Nathanial_Pagac3',
      passwordHash: '$2a$10$ZBJ2Kw27IXAxBagpaUdcGebgDajMO.qjD6CmPdIx2SHfNVmpT1Dne',
      _id: '61cf4d55dbfd8737583558d6',
      __v: 0
    },
    {
      name: 'Terry',
      username: 'Terry.Wiegand89',
      passwordHash: '$2a$10$s1IRFY8U5fUl.3cw.8Co/OV3.xL9dr7O9G8UXhZtMfyTRWod9f7Iu',
      _id: '61cf4d55dbfd8737583558d7',
      __v: 0
    },
    {
      name: 'Kirsten',
      username: 'Kirsten86',
      passwordHash: '$2a$10$yDEBMZvi00Au.CGcbNw/P.BH9ekF.C0XFfSoEzGT6wBtRyr1g6tsC',
      _id: '61cf4d55dbfd8737583558d8',
      __v: 0
    },
    {
      name: 'Janelle',
      username: 'Janelle.Cole',
      passwordHash: '$2a$10$Ie.tCJ/5iVH2M4Vs5jKaUuje0qITgX6GvYqgxVbvs09tlLkoyQQmO',
      _id: '61cf4d55dbfd8737583558d9',
      __v: 0
    },
    {
      name: 'Josefina',
      username: 'Josefina.Frami39',
      passwordHash: '$2a$10$BRuoEZbeUwl4ETnViQzc/ezVhUmYN8/x35ckbeMdeyrk4SFFIcsJa',
      _id: '61cf4d55dbfd8737583558da',
      __v: 0
    }
]

let usersPublicFormat = usersDBFormat.map(createJSONFormattedUser)

async function getUsersInDB() {
    return (await User.find({})).map(user => user.toJSON())
}
  
async function getUserFromDBByID(id) {
    const foundUser = (await User.findById(id)).toJSON()
    return foundUser
}

function createJSONFormattedUser(user) {
    const newUser = {...user}
    delete newUser.passwordHash
    newUser.id = newUser._id
    delete newUser._id
    delete newUser.__v
    return newUser
}

module.exports = { usersDBFormat, usersPublicFormat, getUsersInDB, getUserFromDBByID }