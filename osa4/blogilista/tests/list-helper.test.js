const listHelper = require('../utils/list-helper.js')

describe('list-helper', () => {

  let testBlogList
  beforeEach(() => {
    testBlogList = [
        {
          _id: "5a422a851b54a676234d17f7",
          title: "React patterns",
          author: "Michael Chan",
          url: "https://reactpatterns.com/",
          likes: 7,
          __v: 0
        },
        {
          _id: "5a422aa71b54a676234d17f8",
          title: "Go To Statement Considered Harmful",
          author: "Edsger W. Dijkstra",
          url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
          likes: 5,
          __v: 0
        },
        {
          _id: "5a422b3a1b54a676234d17f9",
          title: "Canonical string reduction",
          author: "Edsger W. Dijkstra",
          url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
          likes: 12,
          __v: 0
        },
        {
          _id: "5a422b891b54a676234d17fa",
          title: "First class tests",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
          likes: 10,
          __v: 0
        },
        {
          _id: "5a422ba71b54a676234d17fb",
          title: "TDD harms architecture",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
          likes: 0,
          __v: 0
        },
        {
          _id: "5a422bc61b54a676234d17fc",
          title: "Type wars",
          author: "Robert C. Martin",
          url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
          likes: 2,
          __v: 0
        }  
      ]
  })

  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })

  describe('totalLikes', () => {
      test('of empty array is 0', () => {
          expect(listHelper.totalLikes([])).toBe(0)
      })
      
      test('of array with one blog is equal to the likes of said blog', () => {
          expect(listHelper.totalLikes(testBlogList.slice(0, 1))).toBe(7)
      })

      test('of array with more than one blog is sum of likes of all blogs', () => {
          expect(listHelper.totalLikes(testBlogList)).toBe(36)
      })
  })

  describe('favoriteBlog', () => {
    
    test('of empty array should return undefined', () => {
      expect(listHelper.favoriteBlog([])).toEqual(undefined)
    })

    test('of array with one blog is said blog', () => {
      expect(listHelper.favoriteBlog(testBlogList.slice(0,1))).toEqual({
        title: "React patterns",
        author: "Michael Chan",
        likes: 7,
      })
    })

    test('of array with multiple blogs is the one with the most likes', () => {
      expect(listHelper.favoriteBlog(testBlogList)).toEqual({
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12,
      })
    })
  })


  describe('totalLikes', () => {
    test('of empty array is 0', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })
    
    test('of array with one blog is equal to the likes of said blog', () => {
        expect(listHelper.totalLikes(testBlogList.slice(0, 1))).toBe(7)
    })

    test('of array with more than one blog is sum of likes of all blogs', () => {
        expect(listHelper.totalLikes(testBlogList)).toBe(36)
    })
  })


  describe('mostblogs', () => {
    test('of empty array should return undefined', () => {
      expect(listHelper.mostBlogs([])).toEqual(undefined)
    })

    test('of array with one blog is author and one', () => {
      expect(listHelper.mostBlogs(testBlogList.slice(0,1))).toEqual({
        author: "Michael Chan",
        blogs: 1,
      })
    })

    test('of array with multiple blogs is the author with the most blogs and number of said blogs', () => {
      expect(listHelper.mostBlogs(testBlogList)).toEqual({
        author: "Robert C. Martin",
        blogs: 3,
      })
    })
  })

  describe('mostLikes', () => {
    test('of empty array should return undefined', () => {
      expect(listHelper.mostLikes([])).toEqual(undefined)
    })

    test('of array with one blog is author and number of likes of said blog', () => {
      expect(listHelper.mostLikes(testBlogList.slice(0,1))).toEqual({
        author: "Michael Chan",
        likes: 7,
      })
    })

    test('of array with multiple blogs is the author with the most total likes and the number of likes', () => {
      expect(listHelper.mostLikes(testBlogList)).toEqual({
        author: "Edsger W. Dijkstra",
        likes: 17,
      })
    })
  })  
})
