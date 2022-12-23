import { exec } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import * as dotenv from 'dotenv'
import NodeEnvironment from 'jest-environment-node'
import { Client } from 'pg'

dotenv.config()

function execSync(command) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
        return
      }

      resolve(stdout.trim())
    })
  })
}

const removeAfterLastSlash = (str: string) => str.substring(0, str.lastIndexOf('/'))

export default class PrismaTestEnvironment extends NodeEnvironment {
  private schema: string
  private connectionString: string
  private baseDbUrl: string

  constructor(config: any) {
    super(config, null)

    const dbUrl = process.env.DATABASE_URL
    this.baseDbUrl = removeAfterLastSlash(dbUrl)
    this.schema = randomUUID()
    this.connectionString = `${this.baseDbUrl}/testing?schema=${this.schema}`
  }

  async setup() {
    const client = new Client({ connectionString: this.baseDbUrl })
    await client.connect()
    const existsTestingDb = await client.query(
      "SELECT FROM pg_database WHERE datname = 'testing'"
    )
    if (!existsTestingDb) await client.query('CREATE DATABASE testing')
    await client.end()

    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString
    await execSync(`prisma migrate deploy`)

    return super.setup()
  }

  async teardown() {
    const client = new Client({ connectionString: this.connectionString })
    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}
