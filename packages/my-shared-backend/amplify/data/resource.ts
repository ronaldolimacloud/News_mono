import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The schema below defines the data models for your application.
The authorization rules determine who can access what data.
=========================================================================*/
const schema = a.schema({
  // Todo model removed
    
  Author: a
    .model({
      name: a.string().required(),
      articles: a.hasMany('News', 'authorId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),
    
  Publisher: a
    .model({
      name: a.string().required(),
      news: a.hasMany('News', 'publisherId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),
    
  News: a
    .model({
      title: a.string().required(),
      body: a.string().required(),
      image: a.string(),
      created_at: a.string(),
      authorId: a.id(),
      publisherId: a.id(),
      author: a.belongsTo('Author', 'authorId'),
      publisher: a.belongsTo('Publisher', 'publisherId'),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
