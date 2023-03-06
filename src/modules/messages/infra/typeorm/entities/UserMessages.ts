import { User } from '@modules/users/infra/typeorm/entities/User';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Message } from './Message';

@Entity('user_messages')
export class UserMessages {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  message_id: string;

  @ManyToOne(() => Message, (message) => message.userMessages, { eager: true })
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column()
  sender_id: string;

  @ManyToOne(() => User, (user: User) => user.userMessages, { eager: true })
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column()
  addressee_id: string;

  @ManyToOne(() => User, (user: User) => user.userMessages, { eager: true })
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;

  @Column()
  replying_to_id: string;

  @OneToOne(() => UserMessages)
  replyingTo: UserMessages;

  @Column()
  forwarding_to_id: string;

  @OneToOne(() => UserMessages)
  forwardingTo: UserMessages;

  @Column()
  read: boolean;

  @Column()
  addressee_delete: boolean;

  @Column()
  sender_delete: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}