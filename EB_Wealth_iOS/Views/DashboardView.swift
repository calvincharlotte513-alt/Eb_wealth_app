import SwiftUI

public struct DashboardView: View {
    @Binding public var profile: UserProfile
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var holdings: [Holding] = []
    @State private var isLoading: Bool = true

    public init(profile: Binding<UserProfile>) {
        self._profile = profile
    }

    public var totalValuation: Double { holdings.reduce(0) { $0 + $1.currentValue } }
    public var totalCost: Double { holdings.reduce(0) { $0 + $1.totalCost } }
    public var totalProfit: Double { totalValuation - totalCost }
    public var returnPct: Double { guard totalCost > 0 else { return 0 }; return (totalProfit / totalCost) * 100 }

    // Allocation breakdown by category
    private var allocations: [(label: String, value: Double, color: String)] {
        var buckets: [String: Double] = [:]
        for h in holdings { buckets[h.allocationCategory, default: 0] += h.currentValue }
        let sorted = buckets.sorted { $0.value > $1.value }
        let colors = ["00F0FF", "FBBF24", "34D399", "A78BFA", "F472B6"]
        return sorted.enumerated().map { idx, pair in
            (label: pair.key, value: pair.value, color: colors[idx % colors.count])
        }
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
                            .padding(.horizontal, 8).padding(.vertical, 3)
                            .background(Color(hex: "34D399").opacity(0.15))
                            .foregroundColor(Color(hex: "34D399"))
                            .cornerRadius(6)
                    }

                    if isLoading {
                        HStack(spacing: 10) {
                            ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "00F0FF")))
                            Text("Loading portfolio…")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "94A3B8"))
                        }
                        .padding(.vertical, 8)
                    } else {
                        Text("£\(String(format: "%.2f", totalValuation))")
                            .font(.system(size: 34, weight: .heavy))
                            .foregroundColor(.white)

                        HStack(spacing: 6) {
                            Image(systemName: totalProfit >= 0 ? "arrow.up.right" : "arrow.down.right")
                                .foregroundColor(totalProfit >= 0 ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                            Text("\(totalProfit >= 0 ? "+" : "")£\(String(format: "%.2f", totalProfit)) (\(String(format: "%.1f", returnPct))%)")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(totalProfit >= 0 ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                            Text("Unrealised Return")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "94A3B8"))
                        }
                    }
                }
                .padding(20)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.3), lineWidth: 1))
                .cornerRadius(16)

                // Allocation Pillars
                if !isLoading && !allocations.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 12) {
                            ForEach(allocations, id: \.label) { alloc in
                                AllocationCard(
                                    title: alloc.label,
                                    value: "£\(String(format: "%.0f", alloc.value))",
                                    pct: totalValuation > 0 ? "\(String(format: "%.1f", (alloc.value / totalValuation) * 100))%" : "—",
                                    color: alloc.color
                                )
                            }
                        }
                    }
                }

                // XP Progress Card
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("INVESTOR XP")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "FBBF24"))
                        Spacer()
                        Text("\(profile.xp) XP")
                            .font(.system(size: 13, weight: .black))
                            .foregroundColor(Color(hex: "FBBF24"))
                    }
                    GeometryReader { geo in
                        ZStack(alignment: .leading) {
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color(hex: "FBBF24").opacity(0.15))
                                .frame(height: 8)
                            RoundedRectangle(cornerRadius: 4)
                                .fill(LinearGradient(colors: [Color(hex: "FBBF24"), Color(hex: "F97316")], startPoint: .leading, endPoint: .trailing))
                                .frame(width: geo.size.width * min(Double(profile.xp) / 500.0, 1.0), height: 8)
                                .animation(.easeInOut(duration: 0.6), value: profile.xp)
                        }
                    }
                    .frame(height: 8)
                    HStack {
                        Text(xpTierLabel(profile.xp))
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Text("\(max(0, 500 - profile.xp)) XP to next tier")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "64748B"))
                    }
                }
                .padding(16)
                .background(Color(hex: "071322").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "FBBF24").opacity(0.25), lineWidth: 1))
                .cornerRadius(14)

                // Streak + Quick Stats
                HStack(spacing: 12) {
                    statCard(icon: "flame.fill", value: "\(profile.streakDays)", label: "Day Streak", color: "F97316")
                    statCard(icon: "briefcase.fill", value: "\(holdings.count)", label: "Holdings", color: "00F0FF")
                    statCard(icon: "shield.fill", value: profile.isPro ? "PRO" : "FREE", label: "Plan", color: "A78BFA")
                }

                // Quick Academy Callout
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("INVESTOR ACADEMY")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "FBBF24"))
                        Text("Master ETFs, ISAs & Compound Returns")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Text("Earn XP to unlock Senior Investor status")
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
        .onAppear(perform: loadData)
    }

    private func loadData() {
        firebaseService.fetchHoldings { fetched in
            holdings = fetched
            isLoading = false
        }
    }

    private func xpTierLabel(_ xp: Int) -> String {
        switch xp {
        case ..<100:  return "🌱 Novice Investor"
        case ..<250:  return "📈 Junior Investor"
        case ..<500:  return "💼 Associate Investor"
        case ..<1000: return "🏆 Senior Investor"
        default:      return "⭐ Elite Wealth Builder"
        }
    }

    private func statCard(icon: String, value: String, label: String, color: String) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(Color(hex: color))
            Text(value)
                .font(.system(size: 16, weight: .black))
                .foregroundColor(.white)
            Text(label)
                .font(.system(size: 10))
                .foregroundColor(Color(hex: "94A3B8"))
        }
        .frame(maxWidth: .infinity)
        .padding(14)
        .background(Color(hex: "0A1628").opacity(0.75))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: color).opacity(0.25), lineWidth: 1))
        .cornerRadius(12)
    }
}

private struct AllocationCard: View {
    let title: String; let value: String; let pct: String; let color: String
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title).font(.system(size: 10, weight: .semibold)).foregroundColor(Color(hex: "94A3B8")).lineLimit(1)
            Text(value).font(.system(size: 14, weight: .bold)).foregroundColor(.white)
            Text(pct).font(.system(size: 11, weight: .bold)).foregroundColor(Color(hex: color))
        }
        .padding(12)
        .frame(width: 120, alignment: .leading)
        .background(Color(hex: "0A1628").opacity(0.75))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: color).opacity(0.2), lineWidth: 1))
        .cornerRadius(12)
    }
}
