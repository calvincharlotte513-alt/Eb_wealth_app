import Foundation
import Combine

// MARK: - Auth Result

public struct AuthResult {
    public let idToken: String
    public let localId: String  // Firebase UID
    public let email: String
    public let displayName: String
}

// MARK: - Firebase Service

/// Handles Firebase Auth (REST) and Firestore (REST) for the EB Wealth iOS app.
/// Uses Firebase Identity Toolkit REST API for auth — no SDK required.
public class FirebaseService: ObservableObject {
    public static let shared = FirebaseService()

    // MARK: Published state
    @Published public var isConnected: Bool = false
    @Published public var lastSyncTimestamp: String = "Not synced"
    @Published public var currentUser: AuthResult? = nil

    public var isAuthenticated: Bool { currentUser != nil }
    public var projectId: String { AppConfig.projectId }
    public var databaseId: String { AppConfig.databaseId }

    private let session = URLSession.shared

    private init() {}

    // MARK: - Auth: Sign Up

    public func signUp(
        email: String,
        password: String,
        firstName: String,
        completion: @escaping (Result<AuthResult, String>) -> Void
    ) {
        let url = URL(string: "\(AppConfig.authBase):signUp?key=\(AppConfig.firebaseAPIKey)")!
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: [
            "email": email,
            "password": password,
            "returnSecureToken": true
        ])

        session.dataTask(with: req) { [weak self] data, _, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(error.localizedDescription)) }
                return
            }
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
            else {
                DispatchQueue.main.async { completion(.failure("Invalid server response.")) }
                return
            }

            if let errBlock = json["error"] as? [String: Any],
               let message = errBlock["message"] as? String {
                DispatchQueue.main.async { completion(.failure(self?.friendlyAuthError(message) ?? message)) }
                return
            }

            guard let idToken = json["idToken"] as? String,
                  let localId = json["localId"] as? String
            else {
                DispatchQueue.main.async { completion(.failure("Unexpected auth response.")) }
                return
            }

            let result = AuthResult(idToken: idToken, localId: localId, email: email, displayName: firstName)
            DispatchQueue.main.async {
                self?.currentUser = result
                self?.isConnected = true
                completion(.success(result))
            }
        }.resume()
    }

    // MARK: - Auth: Sign In

    public func signIn(
        email: String,
        password: String,
        completion: @escaping (Result<AuthResult, String>) -> Void
    ) {
        let url = URL(string: "\(AppConfig.authBase):signInWithPassword?key=\(AppConfig.firebaseAPIKey)")!
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.httpBody = try? JSONSerialization.data(withJSONObject: [
            "email": email,
            "password": password,
            "returnSecureToken": true
        ])

        session.dataTask(with: req) { [weak self] data, _, error in
            if let error = error {
                DispatchQueue.main.async { completion(.failure(error.localizedDescription)) }
                return
            }
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any]
            else {
                DispatchQueue.main.async { completion(.failure("Invalid server response.")) }
                return
            }

            if let errBlock = json["error"] as? [String: Any],
               let message = errBlock["message"] as? String {
                DispatchQueue.main.async { completion(.failure(self?.friendlyAuthError(message) ?? message)) }
                return
            }

            guard let idToken = json["idToken"] as? String,
                  let localId = json["localId"] as? String
            else {
                DispatchQueue.main.async { completion(.failure("Unexpected auth response.")) }
                return
            }

            let displayName = (json["displayName"] as? String) ?? email.components(separatedBy: "@").first ?? "Investor"
            let result = AuthResult(idToken: idToken, localId: localId, email: email, displayName: displayName)
            DispatchQueue.main.async {
                self?.currentUser = result
                self?.isConnected = true
                completion(.success(result))
            }
        }.resume()
    }

    // MARK: - Auth: Sign Out

    public func signOut() {
        DispatchQueue.main.async {
            self.currentUser = nil
            self.isConnected = false
            self.lastSyncTimestamp = "Not synced"
        }
    }

    // MARK: - Firestore: Write Profile

    public func syncProfile(_ profile: UserProfile, completion: @escaping (Bool) -> Void) {
        guard let user = currentUser else { completion(false); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/users/\(user.localId)?updateMask.fieldPaths=firstName&updateMask.fieldPaths=email&updateMask.fieldPaths=experienceLevel&updateMask.fieldPaths=primaryGoal&updateMask.fieldPaths=xp&updateMask.fieldPaths=isPro&updateMask.fieldPaths=streakDays")!
        var req = URLRequest(url: url)
        req.httpMethod = "PATCH"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        req.httpBody = try? JSONSerialization.data(withJSONObject: [
            "fields": [
                "firstName":       ["stringValue": profile.firstName],
                "email":           ["stringValue": profile.email],
                "experienceLevel": ["stringValue": profile.experienceLevel],
                "primaryGoal":     ["stringValue": profile.primaryGoal],
                "xp":              ["integerValue": "\(profile.xp)"],
                "streakDays":      ["integerValue": "\(profile.streakDays)"],
                "isPro":           ["booleanValue": profile.isPro],
                "isOnboarded":     ["booleanValue": profile.isOnboarded]
            ]
        ])
        session.dataTask(with: req) { [weak self] _, response, error in
            DispatchQueue.main.async {
                let ok = error == nil && (response as? HTTPURLResponse)?.statusCode ?? 0 < 300
                if ok {
                    let fmt = DateFormatter(); fmt.dateFormat = "dd MMM, HH:mm:ss"
                    self?.lastSyncTimestamp = fmt.string(from: Date())
                }
                completion(ok)
            }
        }.resume()
    }

    // MARK: - Firestore: Fetch Profile

    public func fetchProfile(completion: @escaping (UserProfile?) -> Void) {
        guard let user = currentUser else { completion(nil); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/users/\(user.localId)")!
        var req = URLRequest(url: url)
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        session.dataTask(with: req) { data, response, _ in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let fields = json["fields"] as? [String: Any]
            else {
                DispatchQueue.main.async { completion(nil) }
                return
            }
            var p = UserProfile()
            p.id = user.localId
            p.email = user.email
            p.firstName = (fields["firstName"] as? [String: String])?["stringValue"] ?? user.displayName
            p.experienceLevel = (fields["experienceLevel"] as? [String: String])?["stringValue"] ?? "Beginner"
            p.primaryGoal = (fields["primaryGoal"] as? [String: String])?["stringValue"] ?? "Build long-term wealth"
            p.isPro = (fields["isPro"] as? [String: Bool])?["booleanValue"] ?? false
            p.isOnboarded = (fields["isOnboarded"] as? [String: Bool])?["booleanValue"] ?? false
            if let xpStr = (fields["xp"] as? [String: String])?["integerValue"], let xp = Int(xpStr) { p.xp = xp }
            if let sdStr = (fields["streakDays"] as? [String: String])?["integerValue"], let sd = Int(sdStr) { p.streakDays = sd }
            p.isLoggedIn = true
            DispatchQueue.main.async { completion(p) }
        }.resume()
    }

    // MARK: - Firestore: Fetch Holdings (under users/{uid}/holdings)

    public func fetchHoldings(completion: @escaping ([Holding]) -> Void) {
        guard let user = currentUser else { completion([]); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/users/\(user.localId)/holdings")!
        var req = URLRequest(url: url)
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        session.dataTask(with: req) { data, _, _ in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let docs = json["documents"] as? [[String: Any]]
            else {
                DispatchQueue.main.async { completion([]) }
                return
            }
            let holdings: [Holding] = docs.compactMap { doc in
                guard let fields = doc["fields"] as? [String: Any] else { return nil }
                let ticker  = (fields["ticker"]  as? [String: String])?["stringValue"] ?? ""
                let name    = (fields["name"]    as? [String: String])?["stringValue"] ?? ticker
                let assetType = (fields["assetType"] as? [String: String])?["stringValue"] ?? "ETF"
                let alloc   = (fields["allocationCategory"] as? [String: String])?["stringValue"] ?? "Global"
                let currency = (fields["currency"] as? [String: String])?["stringValue"] ?? "GBP"
                let shares       = Double((fields["shares"]       as? [String: String])?["doubleValue"] ?? "") ?? 0
                let avgBuy       = Double((fields["avgBuyPrice"]   as? [String: String])?["doubleValue"] ?? "") ?? 0
                let currentPrice = Double((fields["currentPrice"]  as? [String: String])?["doubleValue"] ?? "") ?? 0
                return Holding(ticker: ticker, name: name, assetType: assetType,
                               shares: shares, avgBuyPrice: avgBuy, currentPrice: currentPrice,
                               allocationCategory: alloc, currency: currency)
            }
            DispatchQueue.main.async { completion(holdings) }
        }.resume()
    }

    // MARK: - Firestore: Write Holding

    public func writeHolding(_ holding: Holding, userId: String, completion: @escaping (Bool) -> Void) {
        guard let user = currentUser else { completion(false); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/users/\(user.localId)/holdings/\(holding.ticker)")!
        var req = URLRequest(url: url)
        req.httpMethod = "PATCH"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        req.httpBody = try? JSONSerialization.data(withJSONObject: [
            "fields": [
                "ticker":              ["stringValue": holding.ticker],
                "name":               ["stringValue": holding.name],
                "assetType":          ["stringValue": holding.assetType],
                "allocationCategory": ["stringValue": holding.allocationCategory],
                "currency":           ["stringValue": holding.currency],
                "shares":             ["doubleValue": holding.shares],
                "avgBuyPrice":        ["doubleValue": holding.avgBuyPrice],
                "currentPrice":       ["doubleValue": holding.currentPrice]
            ]
        ])
        session.dataTask(with: req) { _, response, error in
            let ok = error == nil && (response as? HTTPURLResponse)?.statusCode ?? 0 < 300
            DispatchQueue.main.async { completion(ok) }
        }.resume()
    }

    // MARK: - Firestore: Fetch Community Posts

    public func fetchCommunityPosts(completion: @escaping ([CommunityPost]) -> Void) {
        guard let user = currentUser else { completion([]); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/community_posts?orderBy=createdAt desc&pageSize=50")!
        var req = URLRequest(url: url)
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        session.dataTask(with: req) { data, _, _ in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let docs = json["documents"] as? [[String: Any]]
            else {
                DispatchQueue.main.async { completion([]) }
                return
            }
            let posts: [CommunityPost] = docs.compactMap { doc in
                guard let fields = doc["fields"] as? [String: Any] else { return nil }
                let name    = doc["name"] as? String ?? UUID().uuidString
                let id      = name.components(separatedBy: "/").last ?? UUID().uuidString
                let author  = (fields["authorName"]  as? [String: String])?["stringValue"] ?? "Investor"
                let category = (fields["category"]   as? [String: String])?["stringValue"] ?? "UK Investing"
                let title   = (fields["title"]       as? [String: String])?["stringValue"] ?? ""
                let content = (fields["content"]     as? [String: String])?["stringValue"] ?? ""
                let likes   = Int((fields["likesCount"]    as? [String: String])?["integerValue"] ?? "0") ?? 0
                let comments = Int((fields["commentsCount"] as? [String: String])?["integerValue"] ?? "0") ?? 0
                var post = CommunityPost(authorName: author, category: category, title: title, content: content,
                                        likesCount: likes, commentsCount: comments)
                post.id = id
                return post
            }
            DispatchQueue.main.async { completion(posts) }
        }.resume()
    }

    // MARK: - Firestore: Create Community Post

    public func createCommunityPost(_ post: CommunityPost, authorName: String, completion: @escaping (Bool) -> Void) {
        guard let user = currentUser else { completion(false); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/community_posts")!
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        let now = ISO8601DateFormatter().string(from: Date())
        req.httpBody = try? JSONSerialization.data(withJSONObject: [
            "fields": [
                "userId":        ["stringValue": user.localId],
                "authorName":    ["stringValue": authorName],
                "category":      ["stringValue": post.category],
                "title":         ["stringValue": post.title],
                "content":       ["stringValue": post.content],
                "likesCount":    ["integerValue": "0"],
                "commentsCount": ["integerValue": "0"],
                "createdAt":     ["timestampValue": now]
            ]
        ])
        session.dataTask(with: req) { _, response, error in
            let ok = error == nil && (response as? HTTPURLResponse)?.statusCode ?? 0 < 300
            DispatchQueue.main.async { completion(ok) }
        }.resume()
    }

    // MARK: - Firestore: Fetch Lesson Progress

    public func fetchLessonProgress(completion: @escaping ([String: Bool]) -> Void) {
        guard let user = currentUser else { completion([:]); return }
        let url = URL(string: "\(AppConfig.firestoreBase)/lesson_progress?pageSize=50")!
        var req = URLRequest(url: url)
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        session.dataTask(with: req) { data, _, _ in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let docs = json["documents"] as? [[String: Any]]
            else {
                DispatchQueue.main.async { completion([:]) }
                return
            }
            var progress: [String: Bool] = [:]
            for doc in docs {
                guard let fields = doc["fields"] as? [String: Any],
                      let uid = (fields["userId"] as? [String: String])?["stringValue"],
                      uid == user.localId,
                      let lessonId = (fields["lessonId"] as? [String: String])?["stringValue"],
                      let completed = (fields["completed"] as? [String: Bool])?["booleanValue"]
                else { continue }
                progress[lessonId] = completed
            }
            DispatchQueue.main.async { completion(progress) }
        }.resume()
    }

    // MARK: - Firestore: Write Lesson Progress

    public func writeLessonProgress(lessonId: String, completed: Bool, xpReward: Int, completion: @escaping (Bool) -> Void) {
        guard let user = currentUser else { completion(false); return }
        let docId = "\(user.localId)_\(lessonId)"
        let url = URL(string: "\(AppConfig.firestoreBase)/lesson_progress/\(docId)")!
        var req = URLRequest(url: url)
        req.httpMethod = "PATCH"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue("Bearer \(user.idToken)", forHTTPHeaderField: "Authorization")
        let now = ISO8601DateFormatter().string(from: Date())
        req.httpBody = try? JSONSerialization.data(withJSONObject: [
            "fields": [
                "userId":      ["stringValue": user.localId],
                "lessonId":    ["stringValue": lessonId],
                "completed":   ["booleanValue": completed],
                "completedAt": ["timestampValue": now]
            ]
        ])
        session.dataTask(with: req) { _, response, error in
            let ok = error == nil && (response as? HTTPURLResponse)?.statusCode ?? 0 < 300
            DispatchQueue.main.async { completion(ok) }
        }.resume()
    }

    // MARK: - Gemini AI Coach

    public func askGemini(prompt: String, conversationHistory: [(role: String, text: String)], completion: @escaping (String) -> Void) {
        let apiKey = AppConfig.geminiAPIKey
        guard !apiKey.isEmpty else {
            completion("AI Coach is not configured. Please set the GEMINI_API_KEY environment variable.")
            return
        }
        let url = URL(string: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\(apiKey)")!
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let systemInstruction = "You are an expert UK wealth and investment coach for the EB Wealth app. You specialise in UK investing including Stocks & Shares ISAs, Lifetime ISAs, SIPPs, FTSE ETFs, global index funds, dividend investing, and HMRC tax rules. Keep responses concise, practical, and UK-specific. Always encourage low-cost index investing and ISA tax efficiency."

        var contents: [[String: Any]] = [
            ["role": "user", "parts": [["text": systemInstruction]]],
            ["role": "model", "parts": [["text": "Understood. I am your EB Wealth Intelligence Coach, ready to provide expert UK investing guidance."]]]
        ]

        for turn in conversationHistory {
            contents.append(["role": turn.role, "parts": [["text": turn.text]]])
        }
        contents.append(["role": "user", "parts": [["text": prompt]]])

        req.httpBody = try? JSONSerialization.data(withJSONObject: ["contents": contents])

        session.dataTask(with: req) { data, _, error in
            guard let data = data,
                  let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let candidates = json["candidates"] as? [[String: Any]],
                  let first = candidates.first,
                  let content = first["content"] as? [String: Any],
                  let parts = content["parts"] as? [[String: Any]],
                  let text = parts.first?["text"] as? String
            else {
                let msg = error?.localizedDescription ?? "Unable to reach AI Coach. Check your connection."
                DispatchQueue.main.async { completion(msg) }
                return
            }
            DispatchQueue.main.async { completion(text) }
        }.resume()
    }

    // MARK: - Helpers

    private func friendlyAuthError(_ code: String) -> String {
        switch code {
        case "EMAIL_EXISTS":          return "An account with this email already exists. Please sign in."
        case "INVALID_EMAIL":         return "That doesn't look like a valid email address."
        case "WEAK_PASSWORD : Password should be at least 6 characters": return "Password must be at least 6 characters."
        case "EMAIL_NOT_FOUND":       return "No account found with that email. Please create an account."
        case "INVALID_PASSWORD":      return "Incorrect password. Please try again."
        case "INVALID_LOGIN_CREDENTIALS": return "Incorrect email or password. Please try again."
        case "USER_DISABLED":         return "This account has been disabled. Please contact support."
        case "TOO_MANY_ATTEMPTS_TRY_LATER": return "Too many failed attempts. Please try again later."
        default: return code.replacingOccurrences(of: "_", with: " ").capitalized
        }
    }
}
