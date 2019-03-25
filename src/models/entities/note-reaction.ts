import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import * as deepcopy from 'deepcopy';
import { User } from './user';
import { Note } from './note';

@Entity()
@Index(['userId', 'noteId'], { unique: true })
export class NoteReaction {
	@PrimaryColumn('char', { length: 26 })
	public id: string;

	@Index()
	@Column('date', {
		comment: 'The created date of the NoteReaction.'
	})
	public createdAt: Date;

	@Index()
	@Column('integer')
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public user: User | null;

	@Index()
	@Column('integer')
	public noteId: Note['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public note: Note | null;

	@Column('varchar', {
		length: 32
	})
	public reaction: string;
}

/**
 * Pack a reaction for API response
 */
export const pack = (
	reaction: any,
	me?: any
) => new Promise<any>(async (resolve, reject) => {
	let _reaction: any;

	// Populate the reaction if 'reaction' is ID
	if (isObjectId(reaction)) {
		_reaction = await NoteReaction.findOne({
			id: reaction
		});
	} else if (typeof reaction === 'string') {
		_reaction = await NoteReaction.findOne({
			id: new mongo.ObjectID(reaction)
		});
	} else {
		_reaction = deepcopy(reaction);
	}

	// Rename _id to id
	_reaction.id = _reaction.id;
	delete _reaction.id;

	// Populate user
	_reaction.user = await packUser(_reaction.userId, me);

	resolve(_reaction);
});
