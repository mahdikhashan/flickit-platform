# Generated by Django 4.1 on 2023-12-25 11:11

import common.validators
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnswerTemplate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.CharField(max_length=255)),
                ('value', models.PositiveSmallIntegerField()),
                ('index', models.PositiveIntegerField()),
            ],
            options={
                'verbose_name': 'Answer Template',
                'verbose_name_plural': 'Answer Templates',
            },
        ),
        migrations.CreateModel(
            name='AssessmentKit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('title', models.CharField(max_length=100, unique=True)),
                ('summary', models.TextField()),
                ('about', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=False)),
                ('is_private', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Assessment Kit',
                'verbose_name_plural': 'Assessment Kits',
                'ordering': ['title'],
            },
        ),
        migrations.CreateModel(
            name='AssessmentSubject',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.PositiveIntegerField()),
                ('assessment_kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessment_subjects', to='baseinfo.assessmentkit')),
            ],
            options={
                'verbose_name': 'Assessment Subject',
                'verbose_name_plural': 'Assessment Subjects',
            },
        ),
        migrations.CreateModel(
            name='ExpertGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('bio', models.CharField(max_length=200)),
                ('about', models.TextField()),
                ('website', models.CharField(blank=True, max_length=200, null=True)),
                ('picture', models.ImageField(null=True, upload_to='expertgroup/images', validators=[common.validators.validate_file_size])),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': [('manage_expert_group', 'Manage Expert Groups')],
            },
        ),
        migrations.CreateModel(
            name='MaturityLevel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('value', models.PositiveSmallIntegerField()),
                ('index', models.PositiveSmallIntegerField()),
                ('assessment_kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maturity_levels', to='baseinfo.assessmentkit')),
            ],
            options={
                'verbose_name': 'Questionnaire',
                'verbose_name_plural': 'Questionnaires',
                'unique_together': {('title', 'assessment_kit'), ('value', 'assessment_kit'), ('code', 'assessment_kit'), ('index', 'assessment_kit')},
            },
        ),
        migrations.CreateModel(
            name='QualityAttribute',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.PositiveIntegerField(null=True)),
                ('weight', models.PositiveIntegerField(default=1)),
                ('assessment_kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quality_attributes', to='baseinfo.assessmentkit')),
                ('assessment_subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='quality_attributes', to='baseinfo.assessmentsubject')),
            ],
            options={
                'verbose_name': 'Quality Attribute',
                'verbose_name_plural': 'Quality Attributes',
                'unique_together': {('title', 'assessment_kit'), ('code', 'assessment_kit')},
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.TextField()),
                ('description', models.TextField(null=True)),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.IntegerField(null=True)),
                ('may_not_be_applicable', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Question',
                'verbose_name_plural': 'Questions',
            },
        ),
        migrations.CreateModel(
            name='Questionnaire',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('creation_time', models.DateTimeField(auto_now_add=True)),
                ('last_modification_date', models.DateTimeField(auto_now=True)),
                ('index', models.PositiveIntegerField()),
                ('assessment_kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questionnaires', to='baseinfo.assessmentkit')),
            ],
            options={
                'verbose_name': 'Questionnaire',
                'verbose_name_plural': 'Questionnaires',
                'unique_together': {('title', 'assessment_kit'), ('code', 'assessment_kit'), ('index', 'assessment_kit')},
            },
        ),
        migrations.CreateModel(
            name='QuestionImpact',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.PositiveIntegerField(null=True)),
                ('weight', models.PositiveIntegerField(default=1)),
                ('maturity_level', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to='baseinfo.maturitylevel')),
                ('quality_attribute', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to='baseinfo.qualityattribute')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='question_impacts', to='baseinfo.question')),
            ],
        ),
        migrations.AddField(
            model_name='question',
            name='quality_attributes',
            field=models.ManyToManyField(through='baseinfo.QuestionImpact', to='baseinfo.qualityattribute'),
        ),
        migrations.AddField(
            model_name='question',
            name='questionnaire',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseinfo.questionnaire'),
        ),
        migrations.CreateModel(
            name='OptionValue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.DecimalField(decimal_places=2, max_digits=3)),
                ('option', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='option_values', to='baseinfo.answertemplate')),
                ('question_impact', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='option_values', to='baseinfo.questionimpact')),
            ],
        ),
        migrations.CreateModel(
            name='LevelCompetence',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.PositiveIntegerField(null=True)),
                ('maturity_level', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='level_competences', to='baseinfo.maturitylevel')),
                ('maturity_level_competence', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='baseinfo.maturitylevel')),
            ],
        ),
        migrations.CreateModel(
            name='ExpertGroupAccess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('invite_email', models.EmailField(max_length=254, null=True)),
                ('invite_expiration_date', models.DateTimeField(null=True)),
                ('expert_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='baseinfo.expertgroup')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('expert_group', 'user')},
            },
        ),
        migrations.AddField(
            model_name='expertgroup',
            name='users',
            field=models.ManyToManyField(related_name='expert_groups', through='baseinfo.ExpertGroupAccess', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='assessmentsubject',
            name='questionnaires',
            field=models.ManyToManyField(related_name='assessment_subjects', to='baseinfo.questionnaire'),
        ),
        migrations.CreateModel(
            name='AssessmentKitTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('title', models.CharField(max_length=100, unique=True)),
                ('assessmentkits', models.ManyToManyField(related_name='tags', to='baseinfo.assessmentkit')),
            ],
            options={
                'verbose_name': 'Assessment Kit Tag',
                'verbose_name_plural': 'Assessment Kit Tags',
            },
        ),
        migrations.CreateModel(
            name='AssessmentKitLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_kit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='baseinfo.assessmentkit')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AssessmentKitDsl',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dsl_file', models.FileField(upload_to='assessment_kit/dsl', validators=[common.validators.validate_file_size])),
                ('assessment_kit', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dsl', to='baseinfo.assessmentkit')),
            ],
        ),
        migrations.CreateModel(
            name='AssessmentKitAccess',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assessment_kit', models.ForeignKey(db_column='kit_id', on_delete=django.db.models.deletion.CASCADE, to='baseinfo.assessmentkit')),
                ('user', models.ForeignKey(db_column='user_id', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'fak_kit_user_access',
                'unique_together': {('assessment_kit', 'user')},
            },
        ),
        migrations.AddField(
            model_name='assessmentkit',
            name='expert_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assessmentkits', to='baseinfo.expertgroup'),
        ),
        migrations.AddField(
            model_name='assessmentkit',
            name='users',
            field=models.ManyToManyField(related_name='assessment_kit', through='baseinfo.AssessmentKitAccess', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='answertemplate',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answer_templates', to='baseinfo.question'),
        ),
        migrations.AlterUniqueTogether(
            name='question',
            unique_together={('code', 'questionnaire')},
        ),
        migrations.AlterUniqueTogether(
            name='assessmentsubject',
            unique_together={('title', 'assessment_kit'), ('code', 'assessment_kit'), ('index', 'assessment_kit')},
        ),
        migrations.AlterUniqueTogether(
            name='answertemplate',
            unique_together={('index', 'question')},
        ),
    ]
