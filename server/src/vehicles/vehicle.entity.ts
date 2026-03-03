import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.vehicles)
  user: User;

  @Column()
  plateNumber: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ nullable: true })
  vin: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  purchaseDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
