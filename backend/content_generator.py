import anthropic
import os
import json
from datetime import datetime

class ContentGenerator:
    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

    def generate_post(self, params, learning_data=None):
        """
        Generate social media content using Claude API

        Args:
            params: dict with keys like type, platform, tone, audience, topic, season, length
            learning_data: dict with successful_posts and insights from learning system

        Returns:
            dict with generated content for each platform
        """
        prompt = self._build_prompt(params, learning_data)

        try:
            message = self.client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            # Parse response
            response_text = message.content[0].text

            # Try to parse as JSON, if fails, create structured response
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                # If not JSON, structure the response
                result = self._structure_response(response_text, params)

            result['prompt_used'] = prompt
            return result

        except Exception as e:
            print(f"Error generating content: {e}")
            return {
                'error': str(e),
                'facebook': {'content': '', 'hashtags': [], 'visual_suggestions': '', 'call_to_action': ''},
                'instagram': {'content': '', 'hashtags': [], 'visual_suggestions': '', 'call_to_action': ''}
            }

    def _build_prompt(self, params, learning_data):
        """Build comprehensive prompt for Claude"""

        # Business context
        business_context = """
You are creating social media content for Module Masters, a Calgary-based automotive electronics repair company.

BUSINESS OVERVIEW:
- 20+ years of experience in automotive module repair
- Specializes in: ECU, BCM, TCM, airbag modules, ABS, BMW FRM, diesel modules
- Philosophy: "Repair first, not replace" - saving customers money
- Services: In-shop repair + mobile service across Calgary/Alberta
- Target markets: Individual car owners, fleet managers, auto shop owners
- Location pride: Calgary-based, understands Alberta climate challenges

BRAND VOICE:
- Tone: Friendly expert, educational but not condescending
- Values: Honesty, customer savings, technical expertise
- Local: Calgary pride, Alberta climate awareness
- Approachable yet professional
"""

        # Platform-specific guidelines
        platform_guides = {
            'facebook': """
FACEBOOK GUIDELINES:
- Length: 300-500 characters for best engagement
- Style: More detailed explanations, can include links
- Hashtags: 3-5 relevant hashtags
- Audience: Tends to be older, appreciates detailed info
- Can include longer stories and technical details
""",
            'instagram': """
INSTAGRAM GUIDELINES:
- Length: 150-200 characters (short and punchy)
- Style: Visual-first, use emojis strategically, conversational
- Hashtags: 15-20 hashtags (mix of popular and niche)
- Audience: Younger, prefers quick tips and visual content
- Must be engaging in first 2 lines (preview)
""",
            'both': """
Generate content optimized for both Facebook AND Instagram:
- Facebook: 300-500 characters, detailed, 3-5 hashtags
- Instagram: 150-200 characters, punchy, 15-20 hashtags
"""
        }

        # Seasonal context
        season_context = {
            'winter': "Calgary winters are harsh (-30°C). Focus on: cold starts, battery issues, ABS on ice, winter reliability.",
            'spring': "Post-winter checkup time. Focus on: maintenance after winter, fleet service contracts, spring deals.",
            'summer': "Road trip season. Focus on: pre-trip inspections, RV/boat modules, reliability for summer travels.",
            'fall': "Prep for winter. Focus on: winter preparation, fleet maintenance contracts, preventive service."
        }

        # Post type templates
        post_type_guidance = {
            'educational': "Educate customers about how modules work, common issues, and why professional repair matters. Be informative but accessible.",
            'promotional': "Highlight special offers, seasonal deals, or service packages. Create urgency but stay authentic.",
            'customer_story': "Share real (anonymized) success stories. Focus on: problem → solution → savings/outcome. Make it relatable.",
            'seasonal': "Tie service to current season/weather. Address timely pain points Calgary drivers face right now."
        }

        # Audience customization
        audience_guidance = {
            'individual_owners': "Speak to car owners worried about expensive dealership quotes. Emphasize savings, convenience, honesty.",
            'fleet_managers': "Focus on: downtime reduction, cost per vehicle, fleet discounts, reliable service contracts.",
            'shop_owners': "Partner positioning: fast turnaround, wholesale pricing, expand service offerings, technical support."
        }

        # Learning insights section
        learning_section = ""
        if learning_data and learning_data.get('insights'):
            insights = learning_data['insights']
            learning_section = f"""
LEARNING INSIGHTS FROM PAST SUCCESSFUL POSTS:
- Best performing tone: {insights.get('best_tone', 'N/A')}
- Optimal length: {insights.get('optimal_length', 'N/A')}
- Most effective post type: {insights.get('best_post_type', 'N/A')}
- Top performing hashtags: {', '.join(insights.get('effective_hashtags', [])[:5])}

EXAMPLES OF SUCCESSFUL POSTS:
"""
            if learning_data.get('successful_posts'):
                for i, post in enumerate(learning_data['successful_posts'][:3], 1):
                    learning_section += f"\nExample {i} (Rating: {post.get('rating', 'N/A')}/5, Inquiries: {post.get('inquiries_count', 0)}):\n{post.get('content', '')[:200]}...\n"

        # Build final prompt
        prompt = f"""{business_context}

{platform_guides.get(params.get('platform', 'both'), platform_guides['both'])}

POST PARAMETERS:
- Type: {params.get('type', 'educational')} - {post_type_guidance.get(params.get('type', 'educational'), '')}
- Platform: {params.get('platform', 'both')}
- Tone: {params.get('tone', 'friendly')}
- Target Audience: {params.get('audience', 'individual_owners')} - {audience_guidance.get(params.get('audience', 'individual_owners'), '')}
- Topic: {params.get('topic', 'general module repair')}
- Season: {params.get('season', 'current')} - {season_context.get(params.get('season'), 'Consider current Calgary season and weather.')}
- Length preference: {params.get('length', 'medium')}

{learning_section}

REQUIREMENTS:
1. Generate compelling content that matches the parameters above
2. Include Calgary/Alberta local references where appropriate
3. Always include a clear Call-To-Action (CTA):
   - Phone: "Call for free diagnostics"
   - Website: "Visit modulemasters.ca"
   - Mobile service: "We come to you!"
   - Quote: "Get instant quote via our AI chatbot"
4. Suggest specific visual content (photo/graphic ideas)
5. Generate appropriate hashtags:
   - Calgary local: #YYCAutoRepair #CalgaryAuto #YYCBusiness
   - Service specific: #ECURepair #ModuleRepair #AutoElectronics
   - Seasonal: #WinterCarCare #CalgaryWinter (if relevant)
   - Brand: #RepairNotReplace

RESPONSE FORMAT (JSON):
{{
    "facebook": {{
        "content": "Your Facebook post content here (300-500 chars)",
        "hashtags": ["#YYCAutoRepair", "#ECURepair", "..."],
        "visual_suggestions": "Specific photo/graphic idea",
        "call_to_action": "Clear CTA"
    }},
    "instagram": {{
        "content": "Your Instagram post content here (150-200 chars)",
        "hashtags": ["15-20 hashtags including all relevant ones"],
        "visual_suggestions": "Instagram-optimized visual idea",
        "call_to_action": "Clear CTA"
    }},
    "reasoning": "Brief explanation of your approach based on parameters and learning data"
}}

Generate the post now:"""

        return prompt

    def _structure_response(self, text, params):
        """Structure non-JSON response into expected format"""
        platform = params.get('platform', 'both')

        # Basic structure
        result = {
            'facebook': {
                'content': text[:500],
                'hashtags': ['#YYCAutoRepair', '#CalgaryAuto', '#ModuleRepair'],
                'visual_suggestions': 'Photo of module repair work',
                'call_to_action': 'Call for free diagnostics!'
            },
            'instagram': {
                'content': text[:200],
                'hashtags': ['#YYCAutoRepair', '#CalgaryAuto', '#ModuleRepair', '#AutoRepair',
                           '#CarRepair', '#YYC', '#Calgary', '#Alberta'],
                'visual_suggestions': 'Instagram-friendly photo of module repair',
                'call_to_action': 'DM us or visit modulemasters.ca'
            },
            'reasoning': 'Structured from text response'
        }

        return result

    def generate_hashtags(self, content, platform, topic, season=None):
        """Generate relevant hashtags based on content"""
        base_hashtags = ['#YYCAutoRepair', '#CalgaryAuto', '#AlbertaAuto']

        # Service-specific
        service_map = {
            'ECU': ['#ECURepair', '#EngineControlUnit', '#ECUProgramming'],
            'BCM': ['#BCMRepair', '#BodyControlModule'],
            'TCM': ['#TCMRepair', '#TransmissionRepair', '#TransmissionControl'],
            'airbag': ['#AirbagRepair', '#AirbagModule', '#CarSafety'],
            'ABS': ['#ABSRepair', '#ABSModule', '#BrakeSystem'],
            'FRM': ['#BMWRepair', '#FRMRepair', '#BMWModule']
        }

        hashtags = base_hashtags.copy()

        # Add topic-specific tags
        for key, tags in service_map.items():
            if key.lower() in topic.lower():
                hashtags.extend(tags)

        # Add seasonal tags
        if season:
            seasonal_tags = {
                'winter': ['#WinterCarCare', '#CalgaryWinter', '#AlbertaWinter'],
                'spring': ['#SpringCarCheck', '#SpringMaintenance'],
                'summer': ['#SummerRoadTrip', '#SummerCarCare'],
                'fall': ['#FallMaintenance', '#WinterPrep']
            }
            hashtags.extend(seasonal_tags.get(season, []))

        # Platform-specific count
        if platform == 'facebook':
            return hashtags[:5]
        elif platform == 'instagram':
            # Add more generic ones for Instagram
            hashtags.extend(['#AutoRepair', '#CarRepair', '#MobileCarRepair',
                           '#YYC', '#YYCBusiness', '#SupportLocalYYC',
                           '#RepairNotReplace', '#SaveMoneyOnCars'])
            return hashtags[:20]

        return hashtags
