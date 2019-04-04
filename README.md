# State management with Redux 

This project serves as a guide to structure Redux for a real world React application. Once the setup is complete you can start making api calls in no time for any entity in your system. 

**The Problem:** Setting up Redux to work for a React app can be quite challenging and quickly result into a lot of boilerplate being repeated. 

**The Aim:** The aim of this project is to setup Redux in such way that it will reduce the boilerplate to a minimum when adding extra entities to the system and cover most (over 90%) of our api needs. 

> #### _Like this guide?_ **Show your support by giving a :star:**

---

## Docs
- [Demonstrate simplicity](#example)
- [Understanding the Guide](#understanding)
- [Setup](#setup)
- [Actions](#actions)
- [Middlewares](#middlewares)
- [Reducers](#reducers)
- [Selectors](#selectors)
- [react-redux](#react-redux)
- [Production ready](#production-ready)
- [Coming soon](#coming-soon)
- [Help](#help)

---

## Demonstrate simplicity

After the setup the only thing we need to do to introduce a new entity (e.g. user) is to:
1. Include the entity along with its nested relationships in `src/redux/index.js`
2. Call `getReducers` for this entity in `src/redux/reducers/index.js`

With these **two** lines of code we can perform all the actions described in the [Actions](#actions) section for this entity

Then, using the react-redux containers explained [later](#react-redux) in this guide, you can start making your api calls in React in no time!

## Understanding the Guide

There is a Medium article explaining the core concepts of the setup, which you can find [here](https://medium.com/@onoufriosm/state-management-with-redux-50f3ec10c10a). See the end of the article for a video of my presentation at the React London meetup on these concept or follow the link [here](https://www.youtube.com/watch?time_continue=3231&v=yElOj4R4rdA). 

I advise you to read the article before diving into the code. 

You can also run `yarn start` to run a demo application using this code. This relies on some mock api calls found in `src/index.js`, therefore it will return predetermined data and it won't behave as a real world application. Nevertheless, it would be very useful to check the redux devtools to see how the store is structure and how it gets updated in response to different actions.

Finally, you can check the tests under `src/redux/__tests__` to understand how the action->middleware->reducer + selector combination works.


## Setup

Quick summary:
1. Dispatch a `REQUEST` action.
2. Make the api call in the api middleware.
3. Normalize response in the normalize middleware.
4. Store payload in `byId` reducer + update status of api call in one of the other reducers.
+ Access the actions and the stored payload using a Higher Order Component (connect react with redux).

All action creators, reducers and selectors will receive an entityName argument which will be any of the entities type we have in our application (e.g. user, post, comment e.t.c). This means that all of our code is generic and that we only need to write it once and then it will work for any entity in the system without extra boilerplate.

## Actions

All action creators live under `src/redux/actions`

There are action creators for:
1. Reading a single entity (e.g. GET /user/1)
2. Reading multiple entities (e.g. GET /user)
3. Updating a single entity (e.g. PUT /user/1)
4. Updating multiple entities (e.g. PUT /user/1,2). This will probably be different in some projects so you can adjust accordingly.
5. Deleting a single entity (e.g. DELETE /user/1)
6. Deleting multiple entities (e.g. DELETE /user/1,2)
7. Create a single entity (e.g. POST /user)
8. Add an entity to another in a many to many relationship (e.g. POST /post/1/tag/1)
9. Add multiple entities to another in a many to many relationship (e.g. POST /post/1/tag/1,2)
10. Remove an entity from another in a many to many relationship (e.g. DELETE /post/1/tag/1)
11. Remove multiple entities from another in a many to many relationship (e.g. DELETE /post/1/tag/1,2)

All actions return 4 fields:
1. `type`. The type of the action (e.g. `REQUEST_READ_USER`)
2. `params`. These are parameters that will be used by the api service to compute the api endpoint.
3. `meta`. Meta data to be used by the reducers and the normalizer middleware.
4. `options`. Extra options. Typically these can include `onSuccess` and `onFail` functions to be called when the api call is done.

[⇧ back to top](#Docs)

## Middlewares

All middlewares live under `src/redux/middlewares`.

All actions will pass by the middlewares. There are two middlewares:

1. Api middleware. This is responsible for doing the api call (depending on the action type) and responding with success/fail action depending on the type of repsonse
2. Normalize middleware. This will normalize the payload using the [`normalizr`](https://github.com/paularmstrong/normalizr) library and the schema provided by us.

[⇧ back to top](#Docs)

## Reducers

All reducers live under `src/redux/reducers`. There are 6 subreducers for every entity.

1. `byId`. All the normalized data will be stored here.
    - On `SUCCESS_CREATE` the id of the created entity(ies) will be added to the parent entity.
    - On `SUCCESS_DELETE` the id of the deleted entity(ies) will be removed from the parent entity.
    - Same for `SUCCESS_REMOVE`, `SUCCESS_ADD`, `SUCCESS_SET` for many to many relationships.
2. `readIds`. Information about the status of all read calls will be stored here.
  - On `SUCCESS_CREATE` the id of the created entity(ies) will be added to the relevant readId.
  - On `SUCCESS_DELETE` the id of the deleted entity(ies) will be removed from the relevant readId.
3. `updateIds`. Information about the status of all update calls will be stored here.
4. `createIds`. Information about the status of all create calls will be stored here.
5. `deleteIds`. Information about the status of all delete calls will be stored here.
6. `toggleIds`. Information about the status of all toggle calls will be stored here. Toggle refers to remove/add one entity to another in a many to many relationship.

Since the data is stored in a normalized structure it becomes very easy to update relational data. Consider the following example where the initial state:
```
{
  entities: {
    user: {
      1: {
        id: 1,
        posts: [1,2],
      }
    }
  }
}
```

If we create a post (it will receive the id 3) then in the `byId` reducer we can add the id to the `posts` array under the parent entity (in this case user). The new state will become: 

```
{
  entities: {
    user: {
      1: {
        id: 1,
        posts: [1,2. 3],
      }
    }
  }
}
```

Note that there are two ways to retrieve the posts for a user. We could either load the user and return posts as nested data from our backend, which would lead to the initial state above. Or we might want to return the posts for a specific user_id (Usually the case when we paginate data). In this case the initial state would look like this: 

```
{
  entities: {
    post: {
      '{"user_id":1}': { items: [1,2] },
    }
  }
}
```

And the updated state:
```
{
  entities: {
    post: {
      '{"user_id":1}': { items: [1,2, 3] },
    }
  }
}
```

All these are handle automatically and for all entities, so we don't have to worry about updating relationships anymore.

[⇧ back to top](#Docs)

## Selectors

All selectors live under `src/redux/selectors`. The selectors will select either the data from the `byId` reducer and denormalize it or the status of the operation from the `readIds`, `updateIds`, `createIds`, `deleteIds` and `toggleIds` reducers.

[⇧ back to top](#Docs)

## react-redux

All logic for connecting redux and react components live under `src/react-redux`. The mapDispatchToProps and mapStateToProps is moved in to higher order components so that we don't need to redeclare them in every component. You can see how these HOC are used in the example in `src/components`.

Example to read a single entity:
```
<ReadSingleEntityContainer entityName='user' id={1}>
  { props => <MyComponent {...props} /> }
</ReadSingleEntityContainer>
```

1. Wrap your component around the HOC. 
2. Pass the entityName and id props to the HOC.
3. You get access to the `read` action creator, the `entity` (user) that will be returned from the api call, and `status` (isFetching, error).

See `src/components/Main/index.js` for the full example.

[⇧ back to top](#Docs)

## Production ready

This setup is the basis for the Redux setup at [Labstep](https://app.labstep.com/). It is used in production and has accelerated the development drastically. 

[⇧ back to top](#Docs)

## Coming soon

TODO:

1. Add examples for cursor/page based read
2. Add example for caching / optimistic updates
3. Publish to npm (I plan to turn this into a package that everyone can use )

[⇧ back to top](#Docs)

## Help

Feel free to open an issue asking for help. I'll do my best to reply promptly.

[⇧ back to top](#Docs)
