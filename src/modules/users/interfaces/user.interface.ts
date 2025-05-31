import { BaseEntity } from '../../../common/interfaces/base.interface';
import { UserType } from '../dto/create-user.dto';

export interface User extends BaseEntity {
  name: string;
  email: string;
  password: string;
  type: UserType;
}
