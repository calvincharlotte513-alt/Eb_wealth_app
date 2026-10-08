import Foundation

public struct UserProfile: Codable, Identifiable {
    public var id: String = UUID().uuidString
    public var firstName: String = ""
    public var email: String = ""
    public var ageRange: String = "25–34"
    public var country: String = "United Kingdom"
    public var experienceLevel: String = "Beginner"
    public var primaryGoal: String = "Build long-term wealth"
    public var timeHorizon: String = "20+ years"
    public var monthlyCapacity: String = "£150–£500"
    public var riskProfile: String = "Medium"
    public var xp: Int = 0
    public var streakDays: Int = 0
    public var isPro: Bool = false
    public var isLoggedIn: Bool = false
    public var isOnboarded: Bool = false
    
    public init() {}
}

public struct Holding: Codable, Identifiable {
    public var id: String = UUID().uuidString
    public var ticker: String
    public var name: String
    public var assetType: String
    public var shares: Double
    public var avgBuyPrice: Double
    public var currentPrice: Double
    public var allocationCategory: String
    public var currency: String = "GBP"
    
    public var currentValue: Double {
        return shares * currentPrice
    }
    
    public var totalCost: Double {
        return shares * avgBuyPrice
    }
    
    public var profitLoss: Double {
        return currentValue - totalCost
    }
    
    public var profitLossPercent: Double {
        guard totalCost > 0 else { return 0 }
        return (profitLoss / totalCost) * 100.0
    }
}

public struct CommunityPost: Codable, Identifiable {
    public var id: String = UUID().uuidString
    public var authorName: String
    public var category: String
    public var title: String
    public var content: String
    public var likesCount: Int = 0
    public var commentsCount: Int = 0
    public var createdAt: Date = Date()
}

public struct Lesson: Codable, Identifiable {
    public var id: String
    public var title: String
    public var category: String
    public var durationMinutes: Int
    public var xpReward: Int
    public var isCompleted: Bool = false
}
