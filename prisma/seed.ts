import { PrismaClient } from '@prisma/client';

import { parseArgs } from 'node:util';

import * as argon from 'argon2';

const options = {
  email: { type: 'string' },
  password: { type: 'string' },
};

const prisma = new PrismaClient();

async function createRootUser() {
  const {
    values: { email, password },
  } = parseArgs({
    options: { email: { type: 'string' }, password: { type: 'string' } },
  });

  if (email && password) {
    const hash = await argon.hash(password);
    await prisma.user.create({
      data: {
        email,
        password: hash,
        role: 'ROOT',
      },
    });

    console.log(
      `Root user created with email: ${email} and password: ${password}`,
    );
    return;
  }
}

async function main() {
  await createRootUser();
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
