import SwiftUI

public struct PortfolioView: View {
    @State private var holdings: [Holding] = [
        Holding(ticker: "VWRP", name: "Vanguard FTSE All-World UCITS ETF", assetType: "Global ETF", shares: 250, avgBuyPrice: 92.40, currentPrice: 114.20, allocationCategory: "Global Core"),
        Holding(ticker: "VUAG", name: "Vanguard S&P 500 UCITS ETF", assetType: "US Equity ETF", shares: 140, avgBuyPrice: 68.10, currentPrice: 84.50, allocationCategory: "US Equities"),
        Holding(ticker: "ISF", name: "iShares Core FTSE 100 UCITS ETF", assetType: "UK Equity ETF", shares: 800, avgBuyPrice: 7.20, currentPrice: 8.35, allocationCategory: "UK Large Cap"),
        Holding(ticker: "AZN", name: "AstraZeneca PLC", assetType: "UK Individual Stock", shares: 45, avgBuyPrice: 102.50, currentPrice: 118.80, allocationCategory: "Healthcare Core")
    ]
    
    @State private var showOverlapChecker: Bool = false
    
    public init() {}
    
    public var totalValuation: Double {
        holdings.reduce(0) { $0 + $1.currentValue }
    }
    
    public var totalCost: Double {
        holdings.reduce(0) { $0 + $1.totalCost }
    }
    
    public var totalProfit: Double {
        totalValuation - totalCost
    }
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Portfolio Header Summary
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("PORTFOLIO ASSETS")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Button(action: { showOverlapChecker = true }) {
                            HStack(spacing: 4) {
                                Image(systemName: "square.stack.3d.down.right.fill")
                                Text("ETF Overlap Checker")
                            }
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(Color(hex: "00F0FF").opacity(0.15))
                            .cornerRadius(6)
                        }
                    }
                    
                    Text("£\(String(format: "%.2f", totalValuation))")
                        .font(.system(size: 32, weight: .heavy))
                        .foregroundColor(.white)
                    
                    HStack(spacing: 6) {
                        Image(systemName: "arrow.up.forward")
                            .foregroundColor(Color(hex: "34D399"))
                        Text("+£\(String(format: "%.2f", totalProfit)) (+\(String(format: "%.1f", (totalProfit/totalCost)*100))%)")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "34D399"))
                        Text("Unrealised Gain")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                }
                .padding(20)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                .cornerRadius(16)
                
                // Holdings List
                VStack(alignment: .leading, spacing: 10) {
                    Text("ACTIVE HOLDINGS (\(holdings.count))")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "94A3B8"))
                    
                    ForEach(holdings) { h in
                        HStack {
                            VStack(alignment: .leading, spacing: 3) {
                                Text(h.ticker)
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                                Text(h.name)
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "94A3B8"))
                                    .lineLimit(1)
                                Text("\(String(format: "%.1f", h.shares)) shares • Avg £\(String(format: "%.2f", h.avgBuyPrice))")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "64748B"))
                            }
                            
                            Spacer()
                            
                            VStack(alignment: .trailing, spacing: 3) {
                                Text("£\(String(format: "%.2f", h.currentValue))")
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                                Text("+£\(String(format: "%.2f", h.profitLoss)) (+\(String(format: "%.1f", h.profitLossPercent))%)")
                                    .font(.system(size: 11, weight: .semibold))
                                    .foregroundColor(Color(hex: "34D399"))
                            }
                        }
                        .padding(14)
                        .background(Color(hex: "0A1628").opacity(0.7))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "00F0FF").opacity(0.15), lineWidth: 1))
                        .cornerRadius(12)
                    }
                }
            }
            .padding(16)
        }
        .sheet(isPresented: $showOverlapChecker) {
            NavigationView {
                VStack(spacing: 16) {
                    Text("VWRP vs VUAG Overlap")
                        .font(.system(size: 20, weight: .bold))
                    Text("Overlap Percentage: 64.2%")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(Color(hex: "FBBF24"))
                    Text("Holding both funds results in significant double-exposure to Apple, Microsoft, NVIDIA, and Amazon.")
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "94A3B8"))
                        .multilineTextAlignment(.center)
                        .padding()
                    Spacer()
                }
                .padding()
                .navigationTitle("ETF Overlap Analysis")
                .navigationBarItems(trailing: Button("Close") { showOverlapChecker = false })
            }
        }
    }
}
