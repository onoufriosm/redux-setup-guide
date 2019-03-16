# State management with Redux 

This project serves as a guide to structure Redux for a react app. The goal is to setup Redux in such way that it will cover most (over 90%) of your api needs.

> #### _Like this guide?_ **Show your support by giving a :star:**

**Note:** This code is nearly complete (See [Coming soon](#coming-soon)). It is functional and can be used as is or serve as inspiration. Some actions (delete, create) for multiple entities might not work as expected yet.

---

## Table of Contents
- [Setup](#setup)
- [How it works](#how-it-works)
- [Actions](#actions)
- [Middlewares](#middlewares)
- [Reducers](#reducers)
- [Selectors](#selectors)
- [react-redux](#react-redux)
- [Coming soon](#coming-soon)

---

## Setup

All action creators, reducers and selectors will receive an entityName argument which will be any of the entities type we have in our application (e.g. user, post, comment e.t.c). This means that all of our code is generic and that we only need to write it once and then it will work for any entity in the system without extra boilerplate.

## How it works

1. Use a Higher Order Component 
2. Dispatch a `REQUEST` action
3. Call api using api middleware
4. Normalize payload using normalize middleware
5. Update the state with the reducers

## Actions

All action creators live under `src/redux/actions`

All actions return 4 fields:
1. `type`. The type of the action (e.g. `REQUEST_READ_USER`)
2. `params`. These are parameters that will be used by the api service to compute the api endpoint.
3. `meta`. Meta data to be used by the reducers and the normalizer middleware.
4. `options`. Extra options. Typically these can include `onSuccess` and `onFail` functions to be called when the api call is done.

There are action creators for:
1. Reading a single entity (e.g. GET /user/1)
2. Reading multiple entities (e.g. GET /user)
3. Updating a single entity (e.g. PUT /user/1)
4. Updating multiple entities (e.g. PUT /user/1,2). This will probably be different in some projects so you can adjust accordingly.
5. Deleting a single entity (e.g. DELETE /user/1)
6. Create a single entity (e.g. POST /user)
7. Add an entity to another in a many to many relationship (e.g. POST /post/1/tag/1)
7. Remove an entity from another in a many to many relationship (e.g. DELETE /post/1/tag/1)

[⇧ back to top](#table-of-contents)

## Middlewares

All middlewares live under `src/redux/middlewares`.

All actions will pass by the middlewares. There are two middlewares:

1. Api middleware. This is responsible for doing the api call (depending on the action type) and responding with success/fail action depending on the type of repsonse
2. Normalize middleware. This will normalize the payload using the [`normalizr`](https://github.com/paularmstrong/normalizr) library and the schema provided by us.

[⇧ back to top](#table-of-contents)

## Reducers

All reducers live under `src/redux/reducers`. There are 6 subreducers for every entity.

1. `byId`. All the normalized data will be stored here.
    - On `SUCCESS_CREATE` the id of the created entity(ies) will be added to the parent entity.
    - On `SUCCESS_DELETE` the id of the deleted entity(ies) will be removed from the parent entity.
    - Same for `SUCCESS_REMOVE`, `SUCCESS_ADD`, `SUCCESS_SET` for many to many relationships.
2. `readIds`. Information about the status of all read calls will be stored here.
3. `updateIds`. Information about the status of all update calls will be stored here.
4. `createIds`. Information about the status of all create calls will be stored here.
5. `deleteIds`. Information about the status of all delete calls will be stored here.
6. `toggleIds`. Information about the status of all toggle calls will be stored here. Toggle refers to remove/add one entity to another in a many to many relationship.

[⇧ back to top](#table-of-contents)

## Selectors

All selectors live under `src/redux/selectors`. The selectors will select either the data from the `byId` reducer and denormalize it or the status of the operation from the `readIds`, `updateIds`, `createIds`, `deleteIds` and `toggleIds` reducers.

[⇧ back to top](#table-of-contents)

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

[⇧ back to top](#table-of-contents)

## Coming soon

TODO:

1. Fix + make uniform create, delete, toggle for multiple entities 
2. Finish writing unit tests
3. Write examples for cursor/page based read
4. Add caching
5. Add optimistic updates
6. Allow for rxjs/saga replacement
7. Finish writing documentation
8. Publish to npm (I plan to turn this into a package that everyone can use )

[⇧ back to top](#table-of-contents)
