package com.example.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.components.LegalDisclaimerCard
import com.example.ui.theme.*
import kotlin.math.pow

@Composable
fun SimulatorScreen(
    initialInvestment: Double,
    monthlyContribution: Double,
    years: Int,
    annualReturnRate: Double,
    onUpdateSimulator: (initial: Double, monthly: Double, years: Int, returnPct: Double) -> Unit,
    onBack: () -> Unit
) {
    var initial by remember(initialInvestment) { mutableStateOf(initialInvestment) }
    var monthly by remember(monthlyContribution) { mutableStateOf(monthlyContribution) }
    var periodYears by remember(years) { mutableIntStateOf(years) }
    var ratePct by remember(annualReturnRate) { mutableStateOf(annualReturnRate) }

    // Compound calculations
    val r = ratePct / 100.0
    val months = periodYears * 12
    val monthlyRate = r / 12.0

    val fvInitial = initial * (1.0 + monthlyRate).pow(months.toDouble())
    val fvMonthly = if (monthlyRate > 0) {
        monthly * (((1.0 + monthlyRate).pow(months.toDouble()) - 1.0) / monthlyRate)
    } else {
        monthly * months
    }

    val totalFinalValue = fvInitial + fvMonthly
    val totalContributed = initial + (monthly * months)
    val totalCompoundGrowth = (totalFinalValue - totalContributed).coerceAtLeast(0.0)
    val growthPercentage = if (totalFinalValue > 0) (totalCompoundGrowth / totalFinalValue) * 100.0 else 0.0

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Transparent),
        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 16.dp, bottom = 96.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Spacer(modifier = Modifier.width(6.dp))
                Column {
                    Text(
                        text = "Compound Growth Simulator",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color.White
                    )
                    Text(
                        text = "Simulate multi-decade compounding wealth accumulation",
                        fontSize = 12.sp,
                        color = Color(0xFF94A3B8)
                    )
                }
            }
        }

        // Hero Results Card (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x3300F0FF))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "HYPOTHETICAL PORTFOLIO VALUE IN $periodYears YEARS",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFBBF24),
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "£${String.format("%,.0f", totalFinalValue)}",
                        fontSize = 30.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    val contribFraction = if (totalFinalValue > 0) (totalContributed / totalFinalValue).toFloat().coerceIn(0f, 1f) else 1f

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(10.dp)
                            .clip(RoundedCornerShape(5.dp))
                            .background(Color(0xFF34D399))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxHeight()
                                .fillMaxWidth(contribFraction)
                                .background(Color(0xFF00F0FF))
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Your Deposits", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            Text("£${String.format("%,.0f", totalContributed)}", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF00F0FF))
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text("Compound Growth (${String.format("%.0f", growthPercentage)}%)", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            Text("£${String.format("%,.0f", totalCompoundGrowth)}", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color(0xFF34D399))
                        }
                    }
                }
            }
        }

        // Sliders & Controls (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    // Monthly Contribution
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Monthly Contribution", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                        Text("£${monthly.toInt()} / month", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF00F0FF))
                    }
                    Slider(
                        value = monthly.toFloat(),
                        onValueChange = {
                            monthly = it.toDouble()
                            onUpdateSimulator(initial, monthly, periodYears, ratePct)
                        },
                        valueRange = 25f..1500f,
                        steps = 58,
                        colors = SliderDefaults.colors(thumbColor = Color(0xFF00F0FF), activeTrackColor = Color(0xFF00F0FF))
                    )

                    // Quick Comparison Presets: £50 vs £100 vs £250 vs £500
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(50.0, 100.0, 250.0, 500.0).forEach { preset ->
                            val isSel = monthly == preset
                            Surface(
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable {
                                        monthly = preset
                                        onUpdateSimulator(initial, monthly, periodYears, ratePct)
                                    },
                                shape = RoundedCornerShape(8.dp),
                                color = if (isSel) Color(0xFF00F0FF) else Color(0x2200F0FF),
                                border = BorderStroke(1.dp, if (isSel) Color(0xFF00F0FF) else Color(0x3300F0FF))
                            ) {
                                Text(
                                    text = "£${preset.toInt()}",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                    color = if (isSel) Color(0xFF040B14) else Color(0xFFCBD5E1),
                                    modifier = Modifier.padding(vertical = 6.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Investment Horizon Years
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Investment Period", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                        Text("$periodYears years", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF00F0FF))
                    }
                    Slider(
                        value = periodYears.toFloat(),
                        onValueChange = {
                            periodYears = it.toInt()
                            onUpdateSimulator(initial, monthly, periodYears, ratePct)
                        },
                        valueRange = 5f..40f,
                        steps = 34,
                        colors = SliderDefaults.colors(thumbColor = Color(0xFF00F0FF), activeTrackColor = Color(0xFF00F0FF))
                    )

                    // Quick Horizon Presets: 10 vs 20 vs 30 years
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(10, 20, 30, 40).forEach { yrPreset ->
                            val isSel = periodYears == yrPreset
                            Surface(
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable {
                                        periodYears = yrPreset
                                        onUpdateSimulator(initial, monthly, periodYears, ratePct)
                                    },
                                shape = RoundedCornerShape(8.dp),
                                color = if (isSel) Color(0xFF00F0FF) else Color(0x2200F0FF),
                                border = BorderStroke(1.dp, if (isSel) Color(0xFF00F0FF) else Color(0x3300F0FF))
                            ) {
                                Text(
                                    text = "$yrPreset yrs",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                                    color = if (isSel) Color(0xFF040B14) else Color(0xFFCBD5E1),
                                    modifier = Modifier.padding(vertical = 6.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Annual Return Rate
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("Hypothetical Annual Return", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                        Text("${String.format("%.1f", ratePct)}% p.a.", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF34D399))
                    }
                    Slider(
                        value = ratePct.toFloat(),
                        onValueChange = {
                            ratePct = it.toDouble()
                            onUpdateSimulator(initial, monthly, periodYears, ratePct)
                        },
                        valueRange = 3f..12f,
                        steps = 17,
                        colors = SliderDefaults.colors(thumbColor = Color(0xFF34D399), activeTrackColor = Color(0xFF34D399))
                    )
                }
            }
        }

        // Scenario Comparison Breakdown Table (Bank Standard)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xD90A1628)),
                border = BorderStroke(1.dp, Color(0x2800F0FF))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Time Horizon Compounding Comparison", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("At £${monthly.toInt()}/month and 7% annual average return:", fontSize = 12.sp, color = Color(0xFF94A3B8))

                    Spacer(modifier = Modifier.height(10.dp))

                    listOf(10, 20, 30).forEach { compYears ->
                        val m = compYears * 12
                        val mr = 0.07 / 12.0
                        val fv = monthly * (((1.0 + mr).pow(m.toDouble()) - 1.0) / mr)
                        val deposits = monthly * m

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("$compYears Years", fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color.White)
                                Text("Deposited: £${String.format("%,.0f", deposits)}", fontSize = 11.sp, color = Color(0xFF94A3B8))
                            }
                            Text(
                                text = "£${String.format("%,.0f", fv)}",
                                fontWeight = FontWeight.ExtraBold,
                                fontSize = 15.sp,
                                color = if (compYears >= 20) Color(0xFF34D399) else Color(0xFF00F0FF)
                            )
                        }
                        if (compYears < 30) {
                            HorizontalDivider(color = Color(0x1FFFFFFF))
                        }
                    }
                }
            }
        }

        // Legal Disclaimer
        item {
            LegalDisclaimerCard()
        }
    }
}
