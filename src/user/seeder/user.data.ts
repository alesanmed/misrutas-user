import { name, internet } from 'faker';

export const users = [
  {
    username: 'user1',
    password: 'password',
    name: name.firstName(),
    email: internet.email(),
  },
  {
    username: 'user2',
    password: 'password',
    name: name.firstName(),
    email: internet.email(),
  },
  {
    username: 'user3',
    password: 'password',
    name: name.firstName(),
    email: internet.email(),
  },
  {
    username: 'user4',
    password: 'password',
    name: name.firstName(),
    email: internet.email(),
  },
  {
    username: 'user5',
    password: 'password',
    name: name.firstName(),
    email: internet.email(),
  }
];