import SwiftUI

public struct AcademyView: View {
    @State private var lessons: [Lesson] = [
        Lesson(id: "foundations_1", title: "UK Investing Foundations & Tax Wrappers", category: "Basics", durationMinutes: 12, xpReward: 50, isCompleted: true),
        Lesson(id: "isa_sipp", title: "Stocks & Shares ISA vs Lifetime ISA vs SIPP", category: "Tax Efficiency", durationMinutes: 15, xpReward: 75, isCompleted: true),
        Lesson(id: "etf_mastery", title: "Understanding ETFs, Index Funds & OCF Fees", category: "ETFs", durationMinutes: 18, xpReward: 100, isCompleted: false),
        Lesson(id: "compound_interest", title: "The Mathematics of Compound Returns over 20+ Years", category: "Strategy", durationMinutes: 10, xpReward: 50, isCompleted: false),
        Lesson(id: "portfolio_rebalancing", title: "Asset Allocation, Risk Profiles & Rebalancing", category: "Advanced", durationMinutes: 20, xpReward: 150, isCompleted: false)
    ]
    
    public init() {}
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Header
                VStack(alignment: .leading, spacing: 6) {
                    Text("EB WEALTH ACADEMY")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text("Structured UK Wealth Curriculum")
                        .font(.system(size: 22, weight: .heavy))
                        .foregroundColor(.white)
                    Text("Master stocks, index funds, dividend strategies, and HMRC tax wrappers.")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
                .padding(20)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "FBBF24").opacity(0.25), lineWidth: 1))
                .cornerRadius(16)
                
                // Lesson list
                VStack(spacing: 12) {
                    ForEach(lessons) { lesson in
                        HStack(spacing: 14) {
                            Image(systemName: lesson.isCompleted ? "checkmark.circle.fill" : "play.circle.fill")
                                .font(.system(size: 26))
                                .foregroundColor(lesson.isCompleted ? Color(hex: "34D399") : Color(hex: "00F0FF"))
                            
                            VStack(alignment: .leading, spacing: 3) {
                                Text(lesson.title)
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                                HStack(spacing: 8) {
                                    Text("\(lesson.durationMinutes) min")
                                        .font(.system(size: 11))
                                        .foregroundColor(Color(hex: "94A3B8"))
                                    Text("•")
                                        .foregroundColor(Color(hex: "64748B"))
                                    Text("+\(lesson.xpReward) XP")
                                        .font(.system(size: 11, weight: .semibold))
                                        .foregroundColor(Color(hex: "FBBF24"))
                                }
                            }
                            
                            Spacer()
                            
                            Image(systemName: "chevron.right")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "64748B"))
                        }
                        .padding(16)
                        .background(Color(hex: "0A1628").opacity(0.75))
                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "00F0FF").opacity(0.15), lineWidth: 1))
                        .cornerRadius(14)
                    }
                }
            }
            .padding(16)
        }
    }
}
