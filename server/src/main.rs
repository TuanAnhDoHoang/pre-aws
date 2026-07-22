use std::sync::Arc;

use anyhow::Context;
use axum::{
    Json, Router,
    extract::State,
    http::StatusCode,
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use surrealdb::{Surreal, engine::remote::ws::Client};
use tower_http::cors::Any;
use tower_http::cors::CorsLayer;

use crate::{
    price::{Service, ServiceOption, UOM},
    service::Region,
    surreal::connect::connect,
};

mod price;
mod service;
mod surreal;

#[derive(Clone)]
struct AppState {
    db: Arc<Surreal<Client>>,
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv()?;
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_methods(Any)
        .allow_headers(Any);
    let db = connect().await.context("Error during implement database")?;
    let state = AppState { db: Arc::new(db) };

    let app = Router::new()
        .route("/", get(|| async { "Hello, Axum!" }))
        .route("/price", post(handle_fetch_price))
        .with_state(state)
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    println!(
        "🚀 Server đang chạy tại http://{}",
        listener.local_addr().unwrap()
    );

    axum::serve(listener, app).await.unwrap();
    Ok(())
}

#[derive(Debug, Deserialize)]
struct FetchPricePayload {
    region: Region,
    service: Service,
    options: ServiceOption,
}

#[derive(Debug, Serialize, Deserialize)]
struct PriceResponseDto {
    price: f64,
    uom: UOM,
}

async fn handle_fetch_price(
    State(state): State<AppState>,
    Json(payload): Json<FetchPricePayload>,
) -> Result<Json<PriceResponseDto>, (StatusCode, String)> {
    let db = state.db;
    // Gọi hàm truy vấn database bạn đã viết trước đó
    let (price, uom) = price::fetch(&db, &payload.service, &payload.region, &payload.options)
        .await
        .map_err(|err| (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()))?;

    Ok(Json(PriceResponseDto { price, uom }))
}
