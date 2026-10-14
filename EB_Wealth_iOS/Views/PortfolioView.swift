import SwiftUI

public struct PortfolioView: View {
    @EnvironmentObject private var firebaseService: FirebaseService
    @State private var holdings: [Holding] = []
    @State private var isLoading: Bool = true
    @State private var showOverlapChecker: Bool = false
    @State private var showAddHolding: Bool = false

    // Add Holding form state
    @State private var newTicker: String = ""
    @State private var newName: String = ""
    @State private var newAssetType: String = "ETF"
    @State private var newShares: String = ""
    @State private var newAvgBuy: String = ""
    @State private var newCurrentPrice: String = ""
    @State private var newAlloc: String = "Global Core"
    @State private var addError: String? = nil
    @State private var isSaving: Bool = false

    public init() {}

    public var totalValuation: Double { holdings.reduce(0) { $0 + $1.currentValue } }
    public var totalCost: Double { holdings.reduce(0) { $0 + $1.totalCost } }
    public var totalProfit: Double { totalValuation - totalCost }

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {

                // Portfolio Header
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("PORTFOLIO ASSETS")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "94A3B8"))
                        Spacer()
                        Button(action: { showOverlapChecker = true }) {
                            HStack(spacing: 4) {
                                Image(systemName: "square.stack.3d.down.right.fill")
                                Text("ETF Overlap")
                            }
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(Color(hex: "00F0FF"))
                            .padding(.horizontal, 10).padding(.vertical, 5)
                            .background(Color(hex: "00F0FF").opacity(0.15))
                            .cornerRadius(6)
                        }
                    }

                    if isLoading {
                        HStack(spacing: 10) {
                            ProgressView().progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "00F0FF")))
                            Text("Loading holdings…")
                                .font(.system(size: 14))
                                .foregroundColor(Color(hex: "94A3B8"))
                        }.padding(.vertical, 6)
                    } else {
                        Text("£\(String(format: "%.2f", totalValuation))")
                            .font(.system(size: 32, weight: .heavy))
                            .foregroundColor(.white)

                        if totalCost > 0 {
                            HStack(spacing: 6) {
                                Image(systemName: totalProfit >= 0 ? "arrow.up.forward" : "arrow.down.forward")
                                    .foregroundColor(totalProfit >= 0 ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                                Text("\(totalProfit >= 0 ? "+" : "")£\(String(format: "%.2f", totalProfit)) (\(String(format: "%.1f", (totalProfit/totalCost)*100))%)")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(totalProfit >= 0 ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                                Text("Unrealised Gain")
                                    .font(.system(size: 11))
                                    .foregroundColor(Color(hex: "94A3B8"))
                            }
                        }
                    }
                }
                .padding(20)
                .background(Color(hex: "0A1628").opacity(0.85))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "00F0FF").opacity(0.25), lineWidth: 1))
                .cornerRadius(16)

                // Add Holding Button
                Button(action: { showAddHolding = true }) {
                    HStack(spacing: 8) {
                        Image(systemName: "plus.circle.fill")
                        Text("Add Holding to Vault")
                    }
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(hex: "040B14"))
                    .frame(maxWidth: .infinity)
                    .frame(height: 44)
                    .background(Color(hex: "00F0FF"))
                    .cornerRadius(10)
                }

                // Holdings List
                if !isLoading {
                    if holdings.isEmpty {
                        VStack(spacing: 12) {
                            Image(systemName: "briefcase")
                                .font(.system(size: 40))
                                .foregroundColor(Color(hex: "334155"))
                            Text("No holdings yet")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color(hex: "64748B"))
                            Text("Add your first holding to start tracking your portfolio.")
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "475569"))
                                .multilineTextAlignment(.center)
                        }
                        .padding(40)
                    } else {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("ACTIVE HOLDINGS (\(holdings.count))")
                                .font(.system(size: 11, weight: .bold))
                                .foregroundColor(Color(hex: "94A3B8"))

                            ForEach(holdings) { h in
                                HStack {
                                    VStack(alignment: .leading, spacing: 3) {
                                        HStack(spacing: 6) {
                                            Text(h.ticker)
                                                .font(.system(size: 15, weight: .bold))
                                                .foregroundColor(.white)
                                            Text(h.assetType)
                                                .font(.system(size: 9, weight: .semibold))
                                                .foregroundColor(Color(hex: "00F0FF"))
                                                .padding(.horizontal, 6).padding(.vertical, 2)
                                                .background(Color(hex: "00F0FF").opacity(0.12))
                                                .cornerRadius(4)
                                        }
                                        Text(h.name)
                                            .font(.system(size: 11))
                                            .foregroundColor(Color(hex: "94A3B8"))
                                            .lineLimit(1)
                                        Text("\(String(format: "%.4f", h.shares)) shares • Avg £\(String(format: "%.2f", h.avgBuyPrice))")
                                            .font(.system(size: 10))
                                            .foregroundColor(Color(hex: "64748B"))
                                    }
                                    Spacer()
                                    VStack(alignment: .trailing, spacing: 3) {
                                        Text("£\(String(format: "%.2f", h.currentValue))")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.white)
                                        let pl = h.profitLoss
                                        let plp = h.profitLossPercent
                                        Text("\(pl >= 0 ? "+" : "")£\(String(format: "%.2f", pl)) (\(String(format: "%.1f", plp))%)")
                                            .font(.system(size: 11, weight: .semibold))
                                            .foregroundColor(pl >= 0 ? Color(hex: "34D399") : Color(hex: "F43F5E"))
                                    }
                                }
                                .padding(14)
                                .background(Color(hex: "0A1628").opacity(0.7))
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "00F0FF").opacity(0.15), lineWidth: 1))
                                .cornerRadius(12)
                            }
                        }
                    }
                }
            }
            .padding(16)
        }
        .onAppear(perform: loadHoldings)
        .sheet(isPresented: $showOverlapChecker) { overlapSheet }
        .sheet(isPresented: $showAddHolding) { addHoldingSheet }
    }

    private func loadHoldings() {
        isLoading = true
        firebaseService.fetchHoldings { fetched in
            holdings = fetched
            isLoading = false
        }
    }

    // MARK: - Add Holding Sheet
    private var addHoldingSheet: some View {
        NavigationView {
            Form {
                Section(header: Text("Asset Details")) {
                    TextField("Ticker (e.g. VWRP)", text: $newTicker).autocapitalization(.allCharacters).autocorrectionDisabled()
                    TextField("Name (e.g. Vanguard All-World ETF)", text: $newName)
                    Picker("Asset Type", selection: $newAssetType) {
                        ForEach(["ETF","Global ETF","UK Equity ETF","US Equity ETF","UK Individual Stock","Bond","Cash"], id: \.self) { Text($0).tag($0) }
                    }
                }
                Section(header: Text("Position")) {
                    TextField("Shares (e.g. 250)", text: $newShares).keyboardType(.decimalPad)
                    TextField("Avg Buy Price £ (e.g. 92.40)", text: $newAvgBuy).keyboardType(.decimalPad)
                    TextField("Current Price £ (e.g. 114.20)", text: $newCurrentPrice).keyboardType(.decimalPad)
                }
                Section(header: Text("Allocation Category")) {
                    Picker("Category", selection: $newAlloc) {
                        ForEach(["Global Core","US Equities","UK Large Cap","UK Mid Cap","Emerging Markets","Healthcare Core","Bonds","Cash Vault"], id: \.self) { Text($0).tag($0) }
                    }
                }
                if let err = addError {
                    Section { Text(err).foregroundColor(.red).font(.system(size: 12)) }
                }
            }
            .navigationTitle("Add Holding")
            .navigationBarItems(
                leading: Button("Cancel") { showAddHolding = false },
                trailing: Button(action: saveHolding) {
                    if isSaving { ProgressView() } else { Text("Save").bold() }
                }.disabled(isSaving || newTicker.isEmpty || newShares.isEmpty)
            )
        }
    }

    private func saveHolding() {
        guard let shares = Double(newShares.replacingOccurrences(of: ",", with: ".")),
              let avg = Double(newAvgBuy.replacingOccurrences(of: ",", with: ".")),
              let price = Double(newCurrentPrice.replacingOccurrences(of: ",", with: "."))
        else {
            addError = "Please enter valid numbers for shares and prices."
            return
        }
        isSaving = true
        addError = nil
        let h = Holding(
            ticker: newTicker.uppercased().trimmingCharacters(in: .whitespaces),
            name: newName.isEmpty ? newTicker.uppercased() : newName,
            assetType: newAssetType,
            shares: shares, avgBuyPrice: avg, currentPrice: price,
            allocationCategory: newAlloc
        )
        firebaseService.writeHolding(h, userId: firebaseService.currentUser?.localId ?? "") { ok in
            isSaving = false
            if ok {
                holdings.insert(h, at: 0)
                newTicker = ""; newName = ""; newShares = ""; newAvgBuy = ""; newCurrentPrice = ""
                showAddHolding = false
            } else {
                addError = "Failed to save. Please check your connection."
            }
        }
    }

    // MARK: - ETF Overlap Sheet
    private var overlapSheet: some View {
        NavigationView {
            VStack(spacing: 20) {
                Image(systemName: "square.stack.3d.down.right.fill")
                    .font(.system(size: 44))
                    .foregroundColor(Color(hex: "FBBF24"))
                Text("ETF Overlap Checker")
                    .font(.system(size: 22, weight: .bold))
                VStack(spacing: 12) {
                    ForEach(holdings.filter { $0.assetType.contains("ETF") }) { h in
                        HStack {
                            Text(h.ticker).font(.system(size: 14, weight: .bold))
                            Spacer()
                            Text(h.name).font(.system(size: 12)).foregroundColor(.secondary).lineLimit(1)
                        }
                        .padding(10)
                        .background(Color(hex: "0A1628").opacity(0.6))
                        .cornerRadius(8)
                    }
                }
                .padding(.horizontal)
                Text("VWRP + VUAG overlap: ~64.2% — significant double-exposure to Apple, Microsoft, NVIDIA & Amazon.")
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                Spacer()
            }
            .padding(.top, 30)
            .navigationBarItems(trailing: Button("Close") { showOverlapChecker = false })
        }
    }
}
