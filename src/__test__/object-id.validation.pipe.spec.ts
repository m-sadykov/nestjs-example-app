import { ObjectIdValidationPipe } from './../object-id.validation.pipe';
import { ObjectID } from './../common';

function sample(list: Array<any>) {
  return list[Math.floor(Math.random() * list.length)];
}

describe('ObjectId validation pipe', () => {
  const pipe = new ObjectIdValidationPipe();

  it('should return valid object id', () => {
    const id = new ObjectID().toHexString();
    const result = pipe.transform(id);

    expect(result).toBe(id);
  });

  it('should throw BadRequestException in case of invalid object id', async () => {
    try {
      const ids = [
        '82defcf324571e70b0521d79cce2bf3fffccd69',
        'c1a050a4cd1556948d41',
        'zzzzzzzzzzzz',
        'South Africa',
      ];
      const invalidId = sample(ids);

      await pipe.transform(invalidId);
    } catch (exception) {
      expect(exception.response.statusCode).toBe(400);
      expect(exception.response.message).toBe('ObjectId cast error. Invalid id');
    }
  });
});
