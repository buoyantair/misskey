import { Entity, PrimaryColumn, Index, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { User } from './user';
import { App } from './app';

@Entity()
export class AccessToken {
	@PrimaryColumn('char', { length: 26 })
	public id: string;

	@Column('date', {
		comment: 'The created date of the AccessToken.'
	})
	public createdAt: Date;

	@Index()
	@Column('varchar', {
		length: 128
	})
	public token: string;

	@Index()
	@Column('varchar', {
		length: 128
	})
	public hash: string;

	@RelationId((self: AccessToken) => self.user)
	public userId: User['id'];

	@ManyToOne(type => User, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public user: User | null;

	@Column('integer')
	public appId: string;

	@ManyToOne(type => App, {
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	public app: App | null;
}
