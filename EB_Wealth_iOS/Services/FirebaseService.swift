import Foundation
import Combine

public class FirebaseService: ObservableObject {
    public static let shared = FirebaseService()
    
    public let projectId = "com-aistudio-ebwealth-kq-f6b41"
    public let databaseId = "ai-studio-android-ebwealth-8a97b416-8f81-404d-8d7f-be206ae221d3"
    
    @Published public var isConnected: Bool = true
    @Published public var lastSyncTimestamp: String = "Connected"
    
    private init() {}
    
    public func syncProfile(_ profile: UserProfile, completion: @escaping (Bool) -> Void) {
        // Direct REST endpoint for Firebase Firestore
        let urlString = "https://firestore.googleapis.com/v1/projects/\(projectId)/databases/\(databaseId)/documents/users/\(profile.id)"
        guard let url = URL(string: urlString) else {
            completion(false)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: Any] = [
            "fields": [
                "firstName": ["stringValue": profile.firstName],
                "email": ["stringValue": profile.email],
                "experienceLevel": ["stringValue": profile.experienceLevel],
                "primaryGoal": ["stringValue": profile.primaryGoal],
                "xp": ["integerValue": "\(profile.xp)"],
                "isPro": ["booleanValue": profile.isPro]
            ]
        ]
        
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { [weak self] _, response, error in
            DispatchQueue.main.async {
                if error == nil {
                    let formatter = DateFormatter()
                    formatter.dateFormat = "dd MMM, HH:mm:ss"
                    self?.lastSyncTimestamp = formatter.string(from: Date())
                    completion(true)
                } else {
                    completion(false)
                }
            }
        }.resume()
    }
}
