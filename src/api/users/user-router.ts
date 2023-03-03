import express from 'express';
import {
  addFollowertoUser,
  createUserController,
  getUserByIdController,
  getUsersController,
} from './user-controller.js';

const router = express.Router();

router.route('/:id').get(getUserByIdController);
router.route('/').post(createUserController).get(getUsersController);
router.route('/:id/follower/:idFollower').patch(addFollowertoUser);
export default router;
