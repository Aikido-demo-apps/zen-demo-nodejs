import { Pool } from 'pg';
import { parse } from 'url';

// Request classes
export class CreateRequest {
  name: string;

  constructor(data: any) {
    this.name = data.name;
  }
}

export class CommandRequest {
  userCommand: string;

  constructor(data: any) {
    this.userCommand = data.userCommand;
  }
}

export class RequestRequest {
  url: string;

  constructor(data: any) {
    this.url = data.url;
  }
}

export class DatabaseHelper {
  // Regex pattern for input validation - keeping the security vulnerability
  private static REGEX = /^[A-Za-z0-9 ,-.]+$/;

  private static pool: Pool;

  /**
   * Create and return database connection pool
   */
  public static createDbPool(): Pool {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    // Parse the database URL
    const url = parse(databaseUrl);

    // Create connection pool
    this.pool = new Pool({
      host: url.hostname || undefined,
      port: parseInt(url.port || '5432'),
      database: url.pathname ? url.pathname.substring(1) : undefined,
      user: url.auth ? url.auth.split(':')[0] : undefined,
      password: url.auth ? url.auth.split(':')[1] : undefined,
      ssl: false,
      max: 10,
      min: 1,
    });

    // Create table
    this.pool.query(`
      CREATE TABLE IF NOT EXISTS public.pets
      (
        pet_id SERIAL PRIMARY KEY,
        pet_name VARCHAR(255) NOT NULL,
        owner VARCHAR(255) NOT NULL
      )
    `);

    return this.pool;
  }

  /**
   * Validate input string against regex pattern
   */
  public static isValidInput(inputStr: string): boolean {
    return DatabaseHelper.REGEX.test(inputStr);
  }

  /**
   * Clear all pets from the database
   */
  public static async clearAll(): Promise<void> {
    try {
      const result = await this.pool.query('DELETE FROM pets');
      console.log(
        `${result.rowCount} pets have been removed from the database.`,
      );
    } catch (e) {
      console.log(`Database error occurred: ${e}`);
    }
  }

  /**
   * Get all pets from the database
   */
  public static async getAllPets(): Promise<any[]> {
    const pets: any[] = [];
    try {
      const result = await this.pool.query('SELECT * FROM pets');

      for (const row of result.rows) {
        const { pet_id, pet_name, owner } = row;

        // Validate input for XSS risks
        const name = this.isValidInput(pet_name)
          ? pet_name
          : '[REDACTED: XSS RISK]';
        const ownerName = this.isValidInput(owner)
          ? owner
          : '[REDACTED: XSS RISK]';

        pets.push({
          pet_id,
          name,
          owner: ownerName,
        });
      }
    } catch (e) {
      console.log(`Database error occurred: ${e}`);
    }

    return pets;
  }

  /**
   * Get a pet by its ID
   */
  public static async getPetById(id: string): Promise<any> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM pets WHERE pet_id = $1',
        [id],
      );
      if (result.rows.length > 0) {
        const { pet_id, pet_name, owner } = result.rows[0];
        return {
          pet_id,
          name: pet_name,
          owner,
        };
      }
    } catch (e) {
      console.log(`Database error occurred: ${e}`);
    }

    return {
      pet_id: '-1',
      name: 'unknown',
      owner: 'the void',
    };
  }

  /**
   * Create a new pet - keeping the SQL injection vulnerability
   */
  public static async createPetByName(petName: string): Promise<number> {
    try {
      // Deliberately keeping the SQL injection vulnerability
      const query = `INSERT INTO pets (pet_name, owner) VALUES ('${petName}', 'Aikido Security')`;
      const result = await this.pool.query(query);
      return result.rowCount || -1;
    } catch (e) {
      console.log(`Database error occurred: ${e}`);
      return -1;
    }
  }
}

/**
 * Initialize the application with database pool
 */
export function initDatabase(app: any): void {
  const pool = DatabaseHelper.createDbPool();
  app.get('env').db_pool = pool;
}
