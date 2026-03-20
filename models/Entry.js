import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({

  hero: {
    startingPackage: {
      type: String
    },

    heroText: {
      type: String
    },

    typewriterWords: [
      {
        type: String
      }
    ],

    placementText: {
      type: String
    },

    heroImg: {
      type: String
    },
  },


  about: {

    heading: {
      type: String
    },

    description: {
      type: String
    },

    buttonText: {
      type: String
    },

    buttonLink: {
      type: String
    }

  },

  video: {

    heading: {
      type: String
    },

    description: {
      type: String
    },

    videoUrls: [
      {
        type: String
      }
    ]

  },

  courses: [

    {
      image:String,
      title:String,
      points:[String]
    },

    {
      image:String,
      title:String,
      points:[String]
    },

    {
      image:String,
      title:String,
      points:[String]
    }

  ],

  trainers: {

    heading:String,

    description:String,

    topTrainers:[

      {
        image:String,
        name:String,
        role:String,
        badge:String
      },

      {
        image:String,
        name:String,
        role:String
      }

    ],

    team:[

      {
        image:String,
        name:String,
        role:String
      }

    ]

  },

  choose: [
    {
      image: {
        type: String
      },

      title: {
        type: String
      },

      description: {
        type: String
      },

    }
  ],

  footer: {

    talk: {
      phone: {
        type: String
      }
    },

    branches: [
      {
        city: {
          type: String
        },

        address: {
          type: String
        },

        phone: {
          type: String
        }
      }
    ],

  },

}, { timestamps: true });

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;