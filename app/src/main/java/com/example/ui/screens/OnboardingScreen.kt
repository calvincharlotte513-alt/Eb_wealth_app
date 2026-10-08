package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.*

@Composable
fun OnboardingScreen(
    onFinishOnboarding: (experience: String, goal: String, horizon: String, capacity: String, risk: String) -> Unit,
    onSkip: () -> Unit
) {
    var step by remember { mutableIntStateOf(1) }

    var selectedExperience by remember { mutableStateOf("Beginner") }
    var selectedGoal by remember { mutableStateOf("Build long-term wealth") }
    var selectedHorizon by remember { mutableStateOf("20+ years") }
    var selectedCapacity by remember { mutableStateOf("£150–£500") }
    var selectedRisk by remember { mutableStateOf("Medium-High") }

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(20.dp)
            .verticalScroll(scrollState),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Step progress header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "STEP $step OF 6",
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold,
                color = RoyalBluePrimary,
                letterSpacing = 1.sp
            )
            if (step < 6) {
                TextButton(onClick = onSkip) {
                    Text("Skip", color = TextMuted, fontSize = 13.sp)
                }
            }
        }

        LinearProgressIndicator(
            progress = { step / 6f },
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp)
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = RoyalBluePrimary,
            trackColor = SoftGreyContainer
        )

        Spacer(modifier = Modifier.height(20.dp))

        when (step) {
            1 -> {
                OnboardingQuestionLayout(
                    title = "What best describes you?",
                    subtitle = "This helps tailor educational lesson depth and terminology.",
                    options = listOf(
                        "Complete beginner" to "Never invested before, want to learn fundamentals",
                        "Beginner" to "Have heard of ISAs/stocks, looking to start properly",
                        "Intermediate" to "Currently investing, want to optimize portfolio & overlap",
                        "Experienced" to "Active investor focusing on advanced asset allocation"
                    ),
                    selectedOption = selectedExperience,
                    onSelect = { selectedExperience = it },
                    onNext = { step = 2 }
                )
            }
            2 -> {
                OnboardingQuestionLayout(
                    title = "What is your primary investment goal?",
                    subtitle = "Long-term investing works best with clear, defined objectives.",
                    options = listOf(
                        "Build long-term wealth" to "Compounding over decades for financial security",
                        "Retirement" to "Supplementing state & workplace pensions with a SIPP/ISA",
                        "Financial independence" to "Building passive investment cash flow",
                        "Children's future" to "Starting a Junior ISA (JISA) for university or a house deposit",
                        "General investing" to "Growing surplus savings faster than inflation",
                        "Learn before investing" to "Gaining confidence before committing capital"
                    ),
                    selectedOption = selectedGoal,
                    onSelect = { selectedGoal = it },
                    onNext = { step = 3 }
                )
            }
            3 -> {
                OnboardingQuestionLayout(
                    title = "How long do you plan to invest for?",
                    subtitle = "Stock market investments require time to smooth out normal volatility.",
                    options = listOf(
                        "Less than 5 years" to "Short-term horizon (Cash ISA or fixed bonds recommended)",
                        "5–10 years" to "Medium-term growth with balanced allocation",
                        "10–20 years" to "Strong compounding horizon allowing equity focus",
                        "20+ years" to "Maximum compounding potential for generational wealth"
                    ),
                    selectedOption = selectedHorizon,
                    onSelect = { selectedHorizon = it },
                    onNext = { step = 4 }
                )
            }
            4 -> {
                OnboardingQuestionLayout(
                    title = "How much could you potentially invest each month?",
                    subtitle = "Approximate range to calibrate simulator and compounding scenarios.",
                    options = listOf(
                        "£50–£150 / month" to "Ideal starting amount to automate via direct debit",
                        "£150–£500 / month" to "Solid monthly contributions for compound acceleration",
                        "£500–£1,000 / month" to "Substantial pace utilizing significant ISA allowance",
                        "£1,000+ / month" to "Maximizing annual £20,000 UK ISA allowance"
                    ),
                    selectedOption = selectedCapacity,
                    onSelect = { selectedCapacity = it },
                    onNext = { step = 5 }
                )
            }
            5 -> {
                OnboardingQuestionLayout(
                    title = "How comfortable are you with investment fluctuations?",
                    subtitle = "If your £10,000 investment temporarily dropped to £8,500 during a market dip:",
                    options = listOf(
                        "Very Uncomfortable" to "I would worry constantly and want to pull money out",
                        "Slightly Uncomfortable" to "I'd feel nervous but try to wait it out",
                        "Medium-High Comfort" to "I understand volatility is normal and would keep investing",
                        "High Comfort" to "I'd view it as a discount sale and invest more if possible"
                    ),
                    selectedOption = when (selectedRisk) {
                        "Conservative" -> "Very Uncomfortable"
                        "Moderate" -> "Slightly Uncomfortable"
                        "Medium-High" -> "Medium-High Comfort"
                        else -> "High Comfort"
                    },
                    onSelect = { choice ->
                        selectedRisk = when (choice) {
                            "Very Uncomfortable" -> "Conservative"
                            "Slightly Uncomfortable" -> "Moderate"
                            "Medium-High Comfort" -> "Medium-High"
                            else -> "High"
                        }
                    },
                    onNext = { step = 6 }
                )
            }
            6 -> {
                // Generated Investor Profile Result
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(EmeraldGreen.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.VerifiedUser,
                            contentDescription = null,
                            tint = EmeraldGreen,
                            modifier = Modifier.size(32.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "EB INVESTOR PROFILE",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = GoldAccent,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Your Profile is Ready!",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = DarkCharcoal
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "Here is your baseline educational profile calibrated to your goals and risk preferences.",
                        fontSize = 13.sp,
                        color = TextMuted,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(BorderSubtle))
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            ProfileSummaryRow("Experience Level", selectedExperience)
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                            ProfileSummaryRow("Primary Goal", selectedGoal)
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                            ProfileSummaryRow("Time Horizon", selectedHorizon)
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                            ProfileSummaryRow("Monthly Target", selectedCapacity)
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                            ProfileSummaryRow("Risk Profile", selectedRisk)
                            HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = BorderSubtle)
                            ProfileSummaryRow("Starting Level", "Level 1 — Investor Starter (+100 XP)")
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        color = SoftGreyContainer
                    ) {
                        Text(
                            text = "Disclaimer: This educational profile is designed to customize your learning journey. It does not constitute personal financial advice or a suitability assessment under UK financial regulations.",
                            fontSize = 11.sp,
                            lineHeight = 15.sp,
                            color = TextMuted,
                            modifier = Modifier.padding(12.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Button(
                        onClick = {
                            onFinishOnboarding(
                                selectedExperience,
                                selectedGoal,
                                selectedHorizon,
                                selectedCapacity,
                                selectedRisk
                            )
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("launch_dashboard_button")
                    ) {
                        Text(
                            "Enter EB Wealth Dashboard",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun OnboardingQuestionLayout(
    title: String,
    subtitle: String,
    options: List<Pair<String, String>>,
    selectedOption: String,
    onSelect: (String) -> Unit,
    onNext: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = title,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = DarkCharcoal
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = subtitle,
            fontSize = 13.sp,
            color = TextMuted
        )

        Spacer(modifier = Modifier.height(18.dp))

        options.forEach { (optTitle, optDesc) ->
            val isSelected = selectedOption == optTitle
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 5.dp)
                    .clickable { onSelect(optTitle) },
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) RoyalBluePrimary.copy(alpha = 0.08f) else Color.White
                ),
                border = CardDefaults.outlinedCardBorder().copy(
                    brush = androidx.compose.ui.graphics.SolidColor(
                        if (isSelected) RoyalBluePrimary else BorderSubtle
                    )
                )
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RadioButton(
                        selected = isSelected,
                        onClick = { onSelect(optTitle) },
                        colors = RadioButtonDefaults.colors(selectedColor = RoyalBluePrimary)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = optTitle,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = if (isSelected) RoyalBluePrimary else DarkCharcoal
                        )
                        Text(
                            text = optDesc,
                            fontSize = 12.sp,
                            color = TextMuted
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Button(
            onClick = onNext,
            colors = ButtonDefaults.buttonColors(containerColor = RoyalBluePrimary),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .testTag("onboarding_continue_button")
        ) {
            Text("Continue", fontWeight = FontWeight.Bold, fontSize = 15.sp)
        }
    }
}

@Composable
private fun ProfileSummaryRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, fontSize = 13.sp, color = TextMuted)
        Text(value, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = DarkCharcoal)
    }
}
