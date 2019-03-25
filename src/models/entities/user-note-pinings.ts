import { PrimaryColumn, Entity, Index, JoinColumn, Column, ManyToOne } from 'typeorm';
import { Note } from './note';
import { User } from './user';

@Entity()
@Index(['userId', 'noteId'], { unique: true })
export class UserNotePining {
	@PrimaryColumn('char', { length: 26 })
	public id: string;

	@Column('date', {
		comment: 'The created date of the UserNotePinings.'
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

	@Column('integer')
	public noteId: Note['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public note: Note | null;
}
