import User, { IRemoteUser } from '../../../../models/entities/user';
import config from '../../../../config';
import { IBlock } from '../../type';
import unblock from '../../../../services/blocking/delete';
import { apLogger } from '../../logger';

const logger = apLogger;

export default async (actor: IRemoteUser, activity: IBlock): Promise<void> => {
	const id = typeof activity.object == 'string' ? activity.object : activity.object.id;

	const uri = activity.id || activity;

	logger.info(`UnBlock: ${uri}`);

	if (!id.startsWith(config.url + '/')) {
		return null;
	}

	const blockee = await Users.findOne({
		id: new mongo.ObjectID(id.split('/').pop())
	});

	if (blockee === null) {
		throw new Error('blockee not found');
	}

	if (blockee.host != null) {
		throw new Error('ブロック解除しようとしているユーザーはローカルユーザーではありません');
	}

	unblock(actor, blockee);
};
