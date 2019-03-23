import User, { isLocalUser, isRemoteUser } from '../../models/user';
import Following from '../../models/following';../../models/entities/user
import renderPerson fro../../models/entities/followingtypub/renderer/person';
import renderUpdate from '../../remote/activitypub/renderer/update';
import { renderActivity } from '../../remote/activitypub/renderer';
import { deliver } from '../../queue';

export async function publishToFollowers(userId: mongo.ObjectID) {
	const user = await Users.findOne({
		id: userId
	});

	const followers = await Following.find({
		followeeId: user.id
	});

	const queue: string[] = [];

	// フォロワーがリモートユーザーかつ投稿者がローカルユーザーならUpdateを配信
	if (isLocalUser(user)) {
		for (const following of followers) {
			const follower = following._follower;

			if (isRemoteUser(follower)) {
				const inbox = follower.sharedInbox || follower.inbox;
				if (!queue.includes(inbox)) queue.push(inbox);
			}
		}

		if (queue.length > 0) {
			const content = renderActivity(renderUpdate(await renderPerson(user), user));
			for (const inbox of queue) {
				deliver(user, content, inbox);
			}
		}
	}
}
