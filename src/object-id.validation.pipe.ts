import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
  transform(value: any) {
    /**
     * mongoose validation does not provide proper validation of objectId
     * ex: "South Africa" or "zzzzzzzzzzzz" or any 12 character string is considered as valid id
     * issue: https://github.com/Automattic/mongoose/issues/1959
     */
    const objectIdRegEx = new RegExp('^[0-9a-fA-F]{24}$');

    if (!objectIdRegEx.test(value)) {
      throw new BadRequestException('ObjectId cast error. Invalid id');
    }

    return value;
  }
}
