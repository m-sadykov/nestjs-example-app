// import { UserRoleRelationForCreate } from '../models/user-role-rel.model';
import { ObjectID } from '../../common';
import { userRoleRelModel } from '../schema/user-role-rel.schema';
import { UserRoleRelationMapper } from '../user-role-rel.service';

const mapper = new UserRoleRelationMapper();

export async function getMockUserRoleRelations() {
  const relations = [];

  for (let index = 0; index < 20; index++) {
    const rel = {
      roleId: new ObjectID(),
      userId: new ObjectID(),
    };

    const mockRelation = await userRoleRelModel.create(rel);

    relations.push(mapper.fromEntity(mockRelation));
  }

  return relations;
}
