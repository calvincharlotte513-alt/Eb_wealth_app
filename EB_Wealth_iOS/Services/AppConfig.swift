import Foundation

/// Reads API keys injected into Info.plist via build settings / xcconfig.
/// Keys are set as Codemagic environment variables: FIREBASE_API_KEY, GEMINI_API_KEY
public enum AppConfig {
    /// Firebase Web API key — used for Auth REST calls and Firebase initialization.
    public static let firebaseAPIKey: String = {
        let key = Bundle.main.infoDictionary?["FirebaseAPIKey"] as? String ?? ""
        if key.isEmpty || key.hasPrefix("$(") {
            return "AIzaSyChpopTlX_GpukhBua2DdAQOHul1UFrSiM"
        }
        return key
    }()

    /// Gemini API key — used for AI Coach chat.
    public static let geminiAPIKey: String = {
        let key = Bundle.main.infoDictionary?["GeminiAPIKey"] as? String ?? ""
        if key.hasPrefix("$(") {
            return ""
        }
        return key
    }()

    /// Firebase project ID
    public static let projectId = "com-aistudio-ebwealth-kq-f6b41"

    /// Firebase Firestore database ID (named database, not default)
    public static let databaseId = "ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3"

    /// Firestore REST base URL
    public static var firestoreBase: String {
        "https://firestore.googleapis.com/v1/projects/\(projectId)/databases/\(databaseId)/documents"
    }

    /// Firebase Auth REST base URL
    public static let authBase = "https://identitytoolkit.googleapis.com/v1/accounts"
}
