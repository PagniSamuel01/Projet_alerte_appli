import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class FormAlerte {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: false })
  email: string;
  @Column()
  appli: string;
  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date_alerte: Date;
}

