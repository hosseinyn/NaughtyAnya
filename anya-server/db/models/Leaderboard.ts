import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Leaderboard extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username : string

  @Column()
  score : string


}
