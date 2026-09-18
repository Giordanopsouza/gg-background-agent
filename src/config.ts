// Settings the server needs before it starts. Env vars are strings;
// PORT is the only one that has to become a number.
export type WorkerMode = "simulated";

export type AppConfig = {
  host: string;
  port: number;
  databasePath: string;
  workerMode: WorkerMode;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    host: env.HOST ?? "127.0.0.1",
    port: Number(env.PORT ?? "3000"),
    databasePath: env.DATABASE_PATH ?? "./.data/sessions.sqlite",
    workerMode: "simulated",
  };
}
