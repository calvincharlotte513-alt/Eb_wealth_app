import SwiftUI

public struct DashboardView: View {
    @Binding public var profile: UserProfile
    
    public init(profile: Binding<UserProfile>) {
        self._profile = profile
    }
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 18) {
                // Portfolio Valuation Banner
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("TOTAL WEALTH VALUATION")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Text("UK TAX SHIELD ACTIVE")
                            .font(.system(size: 10, weight: .bold))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color(hex: "34D399").opacity(0.15))
                            .foregroundColor(Color(hex: "34D399"))
                            .cornerRadius(6)
                    }
                    
                    Text("£42,850.40")
                        .font(.system(size: 34, weight: .heavy))
                        .foregroundColor(.white)
                    
                    HStack(spacing: 6) {
                        Image(systemName: "arrow.up.right")
                            .foregroundColor(Color(hex: "34D399"))
                        Text("+£3,410.20 (+8.6%)")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "34D399"))
                        Text("All-Time Return")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                }
                .padding(20)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                .cornerRadius(16)
                
                // Allocation Pillars
                HStack(spacing: 12) {
                    AllocationCard(title: "Global Core", value: "£28,500", pct: "66.5%", color: "00F0FF")
                    AllocationCard(title: "UK Large Cap", value: "£8,450", pct: "19.7%", color: "FBBF24")
                    AllocationCard(title: "Cash Vault", value: "£5,900", pct: "13.8%", color: "34D399")
                }
                
                // Quick Academy Callout
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("INVESTOR ACADEMY")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "FBBF24"))
                        Text("Compound Interest & ETF Mastery")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Text("Earn 50 XP to achieve Senior Investor status")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                    Spacer()
                    Image(systemName: "graduationcap.fill")
                        .font(.system(size: 30))
                        .foregroundColor(Color(hex: "00F0FF"))
                }
                .padding(16)
                .background(Color(hex: "071322").opacity(0.8))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "FBBF24").opacity(0.3), lineWidth: 1))
                .cornerRadius(14)
            }
            .padding(16)
        }
    }
}

private struct AllocationCard: View {
    let title: String
    let value: String
    let pct: String
    let color: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title)
                .font(.system(size: 10, weight: .semibold))
                .foregroundColor(Color(hex: "94A3B8"))
            Text(value)
                .font(.system(size: 14, weight: .bold))
                .foregroundColor(.white)
            Text(pct)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(Color(hex: color))
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(hex: "0A1628").opacity(0.75))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: color).opacity(0.2), lineWidth: 1))
        .cornerRadius(12)
    }
}
