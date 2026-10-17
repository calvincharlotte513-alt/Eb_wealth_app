import SwiftUI

public struct AdminDashboardView: View {
    public var onBack: () -> Void

    public init(onBack: @escaping () -> Void = {}) {
        self.onBack = onBack
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Top Bar
                HStack(spacing: 12) {
                    Button(action: onBack) {
                        Image(systemName: "arrow.left")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                            .padding(8)
                            .background(Color.white.opacity(0.1))
                            .clipShape(Circle())
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("EB Wealth Admin Console")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                        Text("Platform analytics, revenue & curriculum management")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                }
                .padding(.horizontal)

                // Key Business Metrics Grid
                VStack(alignment: .leading, spacing: 14) {
                    Text("Executive Platform Summary")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)

                    HStack(spacing: 10) {
                        AdminMetricTile(title: "Total Users", value: "4,820", badge: "+14% MoM", badgeColor: Color(hex: "10B981"))
                        AdminMetricTile(title: "Pro Subscribers", value: "1,248", badge: "£12,410 MRR", badgeColor: Color(hex: "FBBF24"))
                    }

                    HStack(spacing: 10) {
                        AdminMetricTile(title: "Course Completion", value: "68.4%", badge: "Disciplined", badgeColor: Color(hex: "00F0FF"))
                        AdminMetricTile(title: "AI Coach Queries", value: "32,940", badge: "99.8% Safety", badgeColor: Color(hex: "10B981"))
                    }
                }
                .padding(16)
                .background(Color(hex: "0A1226").opacity(0.85))
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1)
                )
                .padding(.horizontal)

                // Most Popular Curriculum & Research
                VStack(alignment: .leading, spacing: 12) {
                    Text("Top Performing Educational Content")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)

                    AdminContentRow(title: "Level 3: Stocks & Shares ISA Tax Fortress", completions: "3,890 completions", passRate: "94% pass")
                    Divider().background(Color.white.opacity(0.1))
                    AdminContentRow(title: "Level 4: The ETF Overlap Trap", completions: "3,410 completions", passRate: "91% pass")
                    Divider().background(Color.white.opacity(0.1))
                    AdminContentRow(title: "Level 1: What is Investing?", completions: "4,210 completions", passRate: "98% pass")
                }
                .padding(16)
                .background(Color(hex: "0A1226").opacity(0.85))
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                .padding(.horizontal)

                // Financial Data & Regulatory Status
                VStack(alignment: .leading, spacing: 10) {
                    Text("Financial Data & Regulatory Status")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)

                    HStack {
                        Text("LSE Live Market Feed:")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Text("● Connected (12ms)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "10B981"))
                    }

                    HStack {
                        Text("HMRC 2024/25 Allowance Engine:")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Text("Active (£20k ISA / £60k SIPP)")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                    }

                    HStack {
                        Text("Cloud Firestore Sync:")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Text("Active & Synchronized")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(hex: "FBBF24"))
                    }
                }
                .padding(16)
                .background(Color(hex: "0A1226").opacity(0.85))
                .cornerRadius(16)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(Color(hex: "040814").ignoresSafeArea())
    }
}

private struct AdminMetricTile: View {
    let title: String
    let value: String
    let badge: String
    let badgeColor: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(Color(hex: "94A3B8"))
            Text(value)
                .font(.system(size: 18, weight: .black))
                .foregroundColor(.white)
            Text(badge)
                .font(.system(size: 10, weight: .bold))
                .foregroundColor(badgeColor)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(Color.white.opacity(0.04))
        .cornerRadius(10)
    }
}

private struct AdminContentRow: View {
    let title: String
    let completions: String
    let passRate: String

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                Text(completions)
                    .font(.system(size: 10))
                    .foregroundColor(Color(hex: "94A3B8"))
            }
            Spacer()
            Text(passRate)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(Color(hex: "10B981"))
        }
    }
}
