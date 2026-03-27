use crate::auth::AuthMethod;
use crate::error::{Result, YamcsError};
use async_trait::async_trait;
use reqwest::{Client, Method, Request, RequestBuilder, Response};
use std::sync::Arc;
use url::Url;

/// HTTP interceptor trait for modifying requests before they are sent
#[async_trait]
pub trait HttpInterceptor: Send + Sync {
    /// Intercept and potentially modify a request
    ///
    /// Returns the request (potentially modified) or an error
    async fn intercept(&self, request: Request) -> Result<Request>;
}

/// HTTP client for YAMCS REST API
pub struct HttpClient {
    client: Client,
    base_url: Url,
    auth: AuthMethod,
    interceptor: Option<Arc<dyn HttpInterceptor>>,
}

impl HttpClient {
    /// Create a new HTTP client
    ///
    /// # Arguments
    /// * `base_url` - Base URL for the YAMCS server (e.g., "http://localhost:8090")
    /// * `auth` - Authentication method to use
    pub fn new(base_url: impl AsRef<str>, auth: AuthMethod) -> Result<Self> {
        let base_url = Url::parse(base_url.as_ref())?;
        let client = Client::builder()
            .build()
            .map_err(|e| YamcsError::Http(e))?;

        Ok(Self {
            client,
            base_url,
            auth,
            interceptor: None,
        })
    }

    /// Create a new HTTP client with custom reqwest client
    pub fn with_client(
        client: Client,
        base_url: impl AsRef<str>,
        auth: AuthMethod,
    ) -> Result<Self> {
        let base_url = Url::parse(base_url.as_ref())?;

        Ok(Self {
            client,
            base_url,
            auth,
            interceptor: None,
        })
    }

    /// Set an HTTP interceptor
    pub fn set_interceptor(&mut self, interceptor: Arc<dyn HttpInterceptor>) {
        self.interceptor = Some(interceptor);
    }

    /// Build a request with the given method and path
    ///
    /// This method handles:
    /// - URL construction from base URL and path
    /// - Authentication headers
    /// - Content-Type headers
    ///
    /// # Arguments
    /// * `method` - HTTP method (GET, POST, etc.)
    /// * `path` - API path (e.g., "/api/user")
    pub fn request(&self, method: Method, path: &str) -> Result<RequestBuilder> {
        let url = self.base_url.join(path)?;
        let mut builder = self.client.request(method, url);

        // Add authentication headers
        match &self.auth {
            AuthMethod::None => {}
            AuthMethod::AccessToken(token) => {
                builder = builder.bearer_auth(token);
            }
            AuthMethod::ClientCert { .. } => {
                // Client certificates are configured at the reqwest::Client level
                // This is handled when building the client, not per-request
            }
        }

        // Add default headers
        builder = builder.header("Accept", "application/json");

        Ok(builder)
    }

    /// Execute a request
    ///
    /// This method:
    /// - Builds the request
    /// - Applies interceptor if configured
    /// - Sends the request
    /// - Checks for HTTP errors
    pub async fn execute(&self, builder: RequestBuilder) -> Result<Response> {
        let mut request = builder.build().map_err(YamcsError::Http)?;

        // Apply interceptor if configured
        if let Some(interceptor) = &self.interceptor {
            request = interceptor.intercept(request).await?;
        }

        let response = self.client.execute(request).await.map_err(YamcsError::Http)?;

        // Check for HTTP errors
        let status = response.status();
        if !status.is_success() {
            // Try to extract error message from response body
            let status_code = status.as_u16();
            let status_text = status.canonical_reason().unwrap_or("Unknown").to_string();

            // Try to parse error body
            let body_text = response
                .text()
                .await
                .unwrap_or_else(|_| String::from("Failed to read error body"));

            // Try to parse as JSON
            let detail: Option<serde_json::Value> = serde_json::from_str(&body_text).ok();

            // Extract message from detail if available
            let message = detail
                .as_ref()
                .and_then(|d| d.get("msg"))
                .and_then(|m| m.as_str())
                .unwrap_or(&status_text)
                .to_string();

            return Err(YamcsError::HttpStatus {
                status: status_code,
                message,
                detail,
            });
        }

        Ok(response)
    }

    /// Make a GET request and parse JSON response
    pub async fn get<T: serde::de::DeserializeOwned>(&self, path: &str) -> Result<T> {
        let builder = self.request(Method::GET, path)?;
        let response = self.execute(builder).await?;
        let data = response.json().await.map_err(YamcsError::Http)?;
        Ok(data)
    }

    /// Make a POST request with JSON body and parse JSON response
    pub async fn post<B: serde::Serialize, T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T> {
        let builder = self.request(Method::POST, path)?.json(body);
        let response = self.execute(builder).await?;
        let data = response.json().await.map_err(YamcsError::Http)?;
        Ok(data)
    }

    /// Make a PUT request with JSON body and parse JSON response
    pub async fn put<B: serde::Serialize, T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T> {
        let builder = self.request(Method::PUT, path)?.json(body);
        let response = self.execute(builder).await?;
        let data = response.json().await.map_err(YamcsError::Http)?;
        Ok(data)
    }

    /// Make a PATCH request with JSON body and parse JSON response
    pub async fn patch<B: serde::Serialize, T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
        body: &B,
    ) -> Result<T> {
        let builder = self.request(Method::PATCH, path)?.json(body);
        let response = self.execute(builder).await?;
        let data = response.json().await.map_err(YamcsError::Http)?;
        Ok(data)
    }

    /// Make a DELETE request
    pub async fn delete(&self, path: &str) -> Result<()> {
        let builder = self.request(Method::DELETE, path)?;
        self.execute(builder).await?;
        Ok(())
    }

    /// Make a DELETE request and parse JSON response
    pub async fn delete_with_response<T: serde::de::DeserializeOwned>(
        &self,
        path: &str,
    ) -> Result<T> {
        let builder = self.request(Method::DELETE, path)?;
        let response = self.execute(builder).await?;
        let data = response.json().await.map_err(YamcsError::Http)?;
        Ok(data)
    }

    /// Get the base URL
    pub fn base_url(&self) -> &Url {
        &self.base_url
    }

    /// Get the authentication method
    pub fn auth(&self) -> &AuthMethod {
        &self.auth
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url_construction() {
        let client =
            HttpClient::new("http://localhost:8090", AuthMethod::None).expect("Failed to create client");
        let url = client.base_url.join("/api/user").expect("Failed to join URL");
        assert_eq!(url.as_str(), "http://localhost:8090/api/user");
    }

    #[test]
    fn test_url_construction_with_trailing_slash() {
        let client = HttpClient::new("http://localhost:8090/", AuthMethod::None)
            .expect("Failed to create client");
        let url = client.base_url.join("api/user").expect("Failed to join URL");
        assert_eq!(url.as_str(), "http://localhost:8090/api/user");
    }
}
