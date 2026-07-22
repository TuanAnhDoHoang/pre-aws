use std::env;
use anyhow::Context;

use surrealdb::Surreal;
use surrealdb::engine::remote::ws::{Client, Ws};
use surrealdb::opt::auth::Root;

pub async fn connect() -> anyhow::Result<Surreal<Client>> {
    let surreal_host = env::var("SURREALDB_WS").context("SURREALDB_WS not found")?;
    let surreal_port = env::var("SURREALDB_PORT").context("SURREALDB_PORT not found")?;
    let surreal_username = env::var("SURREALDB_USERNAME").context("SURREALDB_USERNAME not found")?;
    let surreal_password = env::var("SURREALDB_PASSWORD").context("SURREALDB_PASSWORD not found")?;
    let surreal_namespace = env::var("SURREALDB_NAMESPACE").context("SURREALDB_NAMESPACE not found")?;
    let surreal_dbname = env::var("SURREALDB_NAME").context("SURREALDB_NAME not found")?;
    // Connect to the server
    let db = Surreal::new::<Ws>(format!("{}:{}", surreal_host, surreal_port)).await?;

    // Signin as a namespace, database, or root user
    db.signin(Root {
        username: surreal_username,
        password: surreal_password,
    })
    .await?;

    // Select a specific namespace / database
    db.use_ns(surreal_namespace).use_db(surreal_dbname).await?;

    Ok(db)
}
