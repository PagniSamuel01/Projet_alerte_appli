import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class FormAlerte {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: false })
  email: string;
  @Column()
  appli: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date_alerte: Date;
}
